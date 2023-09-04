import { useLocation } from "react-router-dom";
import { IRecipe } from "./Meal";
import { LuGlassWater } from "react-icons/lu";
import { meals } from "./Mealplan";
import { googleCalendarId } from "./Profile/Calendar";
import { useState } from "react";
import { addEvent, addMinutesToDate, getSpecificHourDate } from "./utils";
import Menu from "../components/Menu";


const Water = () => {

    const location = useLocation();

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

    const [waterDrinks, setWaterDrinks] = useState(0);

    return (
        <div className="profile-container">
            <Menu />
            {waterEvents.map
                ((event) => {
                    return (
                        <div>
                            <p>{event.summary} at {event.start.dateTime.toString()}</p>
                        </div>
                    )
                }
                )}
            <p> Easily log your water consumption and track your progress toward staying adequately hydrated.</p>
            <hr />
            <div>Water to drink: <div className="water">{waterDrinks} / 5 000 ml</div></div>
            <div onClick={() => setWaterDrinks(waterDrinks + 250)}>
                <LuGlassWater size={24} /> + 250 ml
            </div>
            <button onClick={() => addWaterEvents()} className="primary-button">Add reminders to callendar</button>
        </div>
    )
}

export default Water;