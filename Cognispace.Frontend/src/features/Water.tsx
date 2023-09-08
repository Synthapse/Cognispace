import { useLocation } from "react-router-dom";
import { IRecipe } from "./Meal";
import { LuGlassWater } from "react-icons/lu";
import { meals } from "./Mealplan";
import { googleCalendarId } from "./Profile/Calendar";
import { useEffect, useState } from "react";
import { addEvent, addMinutesToDate, getSpecificHourDate } from "./utils";
import Menu from "../components/Menu";
import { IWaterEvent, auth, readFirebaseUserData, writeWaterStatsData } from "../auth/firebase";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import "../style/water.scss";
import { DocumentData } from "firebase/firestore";


const Water = () => {

    const location = useLocation();
    const [chartData, setChartData] = useState<IGraphWaterEvent[]>([])
    const breakfastTime = getSpecificHourDate(meals.find(x => x.name === "Breakfast")?.time || 0)

    const generateWaterEvents = () => {
        return Array.from({ length: 10 }, (_, i) => ({
            summary: "Drinks Water",
            location: "",
            start: {
                dateTime: addMinutesToDate(breakfastTime, i * 60 + 55),
                timeZone: "Europe/Bucharest"
            },
            end: {
                dateTime: addMinutesToDate(breakfastTime, i * 60 + 60),
                timeZone: "Europe/Bucharest"
            },
            recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
            attendees: [],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: "email", minutes: 24 * 60 },
                    { method: "popup", minutes: 10 }
                ]
            }
        }));
    };

    const waterEvents = generateWaterEvents();

    const addWaterEvents = () => {
        for (let i = 0; i < waterEvents.length; i++) {
            addEvent(googleCalendarId, waterEvents[i])
        }
    }
    const today = new Date().toISOString().split('T')[0];


    const uploadWaterAmount = () => {

        const lastChartData = chartData[chartData.length - 1];
        if (auth.currentUser) {
            const waterStats = {
                userId: auth.currentUser.uid,
                amount: lastChartData.name === today ? lastChartData.amount + 250 : 250,
                date: new Date().toISOString().split('T')[0]
            }
            writeWaterStatsData(waterStats);
        }
        readWaterStats()
    }

    const readWaterStats = async () => {
        const waterStats = await readFirebaseUserData(auth?.currentUser?.uid ?? "", "waterstats")

        const stats = waterStats.map((x: DocumentData) => ({
            name: x.date,
            amount: x.amount
        }))

        setChartData(stats.sort((a: IGraphWaterEvent, b: IGraphWaterEvent) => new Date(a.name).getTime() - new Date(b.name).getTime()))
    }

    useEffect(() => {
        readWaterStats()
    }, [])


    const findNearestFutureEvent = (events: any[]) => {
        const currentTime = new Date();

        const futureEvents = events.filter((event) => {
            if (event.start && event.start.dateTime) {
                const eventTime = new Date(event.start.dateTime);
                return eventTime > currentTime; // Only keep events in the future
            }
            return false;
        });

        if (futureEvents.length === 0) {
            return null; // No future events found
        }

        const nearestEvent = futureEvents.reduce((nearest, event) => {
            if (event.start && event.start.dateTime) {
                const eventTime = new Date(event.start.dateTime);
                const timeDifference: number = eventTime.getTime() - currentTime.getTime();

                if (timeDifference < nearest.timeDifference) {
                    return { event, timeDifference };
                }
            }

            return nearest;
        }, { event: null, timeDifference: Infinity });

        return nearestEvent.event;
    }


    const todayWater = chartData.find(x => x.name == today)?.amount ?? 0;

    const currentWaterEvent = findNearestFutureEvent(waterEvents);
    const hours = currentWaterEvent.start.dateTime.getHours();
    const minutes = currentWaterEvent.start.dateTime.getMinutes();

    return (
        <div className="profile-container">
            <Menu />
            <p> Easily log your water consumption and track your progress toward staying adequately hydrated.</p>
            {hours}:{minutes}

            <div className="progress-bar-container">
                <ProgressBar key={"1"} bgcolor={"#6a1b9a"} completed={todayWater * 100 / 2000} />
                <div onClick={() => uploadWaterAmount()} className="water-glass circle">
                    <div onClick={() => uploadWaterAmount()}>
                        <LuGlassWater size={14} /> +
                    </div>
                </div>
            </div>
            <DailyWaterChart initialChartData={chartData} />
            <button onClick={() => addWaterEvents()} className="primary-button">Add reminders to callendar</button>
        </div>
    )
}

interface IGraphWaterEvent {
    name: string;
    amount: number;
}

interface IDailyWaterChart {
    initialChartData: IGraphWaterEvent[];
}

const DailyWaterChart = ({ initialChartData }: IDailyWaterChart) => {

    const fillMissingDate = (data: IGraphWaterEvent[]): IGraphWaterEvent[] => {
        const dateSet = new Set(data.map(({ name }) => name));

        //@ts-ignore
        const startDate = new Date(Math.min(...Array.from(dateSet).map(date => new Date(date))));
        //@ts-ignore
        const endDate = new Date(Math.max(...Array.from(dateSet).map(date => new Date(date))));

        const result: IGraphWaterEvent[] = [];

        for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            const currentDateStr = currentDate.toISOString().split('T')[0];
            result.push({
                name: currentDateStr,
                amount: dateSet.has(currentDateStr) ? data.find((entry) => entry.name === currentDateStr)!.amount : 0,
            });
        }

        return result;
    };

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const initialDaysData = fillMissingDate(initialChartData).map((x: IGraphWaterEvent) => ({
        name: daysOfWeek[new Date(x.name).getDay()],
        amount: x.amount
    }))

    return (
        <div>
            <AreaChart width={620} height={320} data={initialDaysData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5B86E5" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#36D1DC" stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5B86E5" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#36D1DC" stopOpacity={0.5} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#36D1DC" fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
        </div>
    )
}

const ProgressBar = (props: any) => {
    const { bgcolor, completed } = props;

    const containerStyles = {
        height: 7,
        width: '400px',
        backgroundColor: "#e0e0de",
        borderRadius: 50,
    }

    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        background: 'linear-gradient(to right, #5B86E5, #36D1DC)',
        borderRadius: 'inherit',

    }

    const labelStyles = {
        padding: 5,
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold'
    }

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${completed}%`}</span>
            </div>
        </div>
    );
};

export default Water;