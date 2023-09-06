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
    console.log(waterEvents);

    const addWaterEvents = () => {
        for (let i = 0; i < waterEvents.length; i++) {
            addEvent(googleCalendarId, waterEvents[i])
        }
    }

    const uploadWaterAmount = () => {

        const date = chartData[0].name;
        const today = new Date().toISOString().split('T')[0];

        if (auth.currentUser) {
            const waterStats = {
                userId: auth.currentUser.uid,
                amount: date === today ? chartData[0]?.amount + 250 : 250,
                date: new Date().toISOString().split('T')[0]
            }
            writeWaterStatsData(waterStats);
        }
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

    return (
        <div className="profile-container">
            <Menu />
            <p> Easily log your water consumption and track your progress toward staying adequately hydrated.</p>
            <div className="water-events">
                {waterEvents.map
                    ((event, index) => {

                        const hours = event.start.dateTime.getHours();
                        const minutes = event.start.dateTime.getMinutes();

                        return (
                            <div onClick={() => uploadWaterAmount()} className="water-glass" key={index}>
                                <div onClick={() => uploadWaterAmount()}>
                                    <LuGlassWater size={14} /> + 250 ml
                                </div>
                                {hours}:{minutes}
                            </div>
                        )
                    }
                    )}
            </div>
            <hr /><div className="water">{chartData[0]?.amount} / 2 000 ml</div>
            <button onClick={() => addWaterEvents()} className="primary-button">Add reminders to callendar</button>
            <DailyWaterChart initialChartData={chartData} />
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

    return (
        <div>
            <AreaChart width={730} height={250} data={initialChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
        </div>
    )
}

export default Water;