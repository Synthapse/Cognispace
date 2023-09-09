import { useLocation } from "react-router-dom";
import { IRecipe } from "./Meal";
import { LuGlassWater } from "react-icons/lu";
import { meals } from "./Mealplan";
import { googleCalendarId } from "./Profile/Calendar";
import { useEffect, useState } from "react";
import { addEvent, addMinutesToDate, findNearestFutureEvents, findPositionsInFirstArray, getSpecificHourDate } from "./utils";
import Menu from "../components/Menu";
import { IWaterEvent, auth, readFirebaseUserData, writeWaterStatsData } from "../auth/firebase";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

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


    const todayWater = chartData.find(x => x.name == today)?.amount ?? 0;
    const currentWaterEvents = findNearestFutureEvents(waterEvents);
    const todayWaterAmount = chartData.find(x => x.name == today)?.amount ?? 0;

    const fulfillmentStatus = currentWaterEvents.map((event: any, index: number) => {
        // Retrieve the position for the current event
        const positions = findPositionsInFirstArray(waterEvents, currentWaterEvents);
        const position = positions[index];

        // Calculate the accumulated amount up to this event
        if (!position) {
            return false;
        }
        const accumulatedAmount = position * 250;

        // Check if the event is fulfilled
        return accumulatedAmount <= todayWaterAmount;
    });


    return (
        <div className="profile-container">
            <Menu />
            Water alerts: 
            <p> Easily log your water consumption and track your progress toward staying adequately hydrated.</p>

            <div className="current-water-streak">
                {currentWaterEvents.map((event: any, index: number) => {
                    const hours = event?.start.dateTime.getHours();
                    const minutes = event?.start.dateTime.getMinutes();

                    const className = fulfillmentStatus[index] ? "water-glass circle center" : "water-glass-empty circle center";

                    return (
                        <div>
                            <div className={className}>
                                <LuGlassWater size={14} />
                            </div>
                            <p>{hours}:{minutes}</p>
                        </div>
                    )

                })}
            </div>


            <div className="progress-bar-container">
                <ProgressBar key={"1"} bgcolor={"#6a1b9a"} completed={todayWater * 100 / 2000} />
                <div onClick={() => uploadWaterAmount()} className="water-glass circle">
                    <div onClick={() => uploadWaterAmount()}>
                        +
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

    const [isMonthly, setIsMonthly] = useState<boolean>(false)

    return (
        <div>
            {!isMonthly ?

                <BarChart width={620} height={320} data={initialDaysData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#4B73E9" />
                </BarChart>
                :
                <AreaChart width={620} height={320} data={initialDaysData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4B73E9" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#4B73E9" stopOpacity={0.5} />
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4B73E9" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#4B73E9" stopOpacity={0.5} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="amount" stroke="#4B73E9" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
            }
        </div>
    )
}




const ProgressBar = (props: any) => {
    const { bgcolor, completed } = props;

    const containerStyles = {
        height: 4,
        width: '400px',
        backgroundColor: "#e0e0de",
        borderRadius: 50,
    }

    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        background: 'linear-gradient(to right, #4B73E9, #6092F3)',
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