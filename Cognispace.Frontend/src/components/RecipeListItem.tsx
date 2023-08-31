import { BiTimer } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { IRecipe } from "../features/Meal";
import { BsBarChartSteps } from "react-icons/bs";
import { PiBowlFood } from "react-icons/pi";
import { Tag } from "./Tag";

import "./listitem.scss"
import { googleCalendarId } from "../features/Profile/Calendar";
import { addEvent } from "../features/utils";
import { meals } from "../features/Mealplan";

const RecipeListItem = ({ recipe, meal }: { recipe: IRecipe, meal?: string }) => {

    const navigate = useNavigate();

    const navigateToRecipe = () => {
        navigate("/recipe", { state: { recipe: recipe } });
    };

    const getSpecificHourDate = (hour: number, minute = 0, second = 0) => {
        const now = new Date(); // Current date and time
        const specificDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hour,
            minute,
            second
        );
        return specificDate;
    }

    const addMinutesToDate = (date: Date, minutes: number) => {
        return new Date(date.getTime() + minutes * 60000);
    }

    const startDate = getSpecificHourDate(meals.find(x => x.name === meal)?.time || 0)


    return (
        <div onClick={() => navigateToRecipe()} className="recipe-list-item">
            <h2 key={recipe.id}>{recipe.name}</h2>
            <div className="recipe-list-item-details">
                <p><BiTimer size={18} /> {recipe.minutes} min</p>
                <p><BsBarChartSteps size={18} /> {recipe.steps.length} steps</p>
                <p><PiBowlFood size={18} /> {recipe.ingredients.length} ingredients</p>
            </div>
            <div className="tags">{recipe.tags.map(x => <Tag text={x} />)}</div>
            <button onClick={() => addEvent(googleCalendarId, {
                summary: recipe.name,
                location: "",
                start: {
                    dateTime: startDate,
                    timeZone: "Europe/Bucharest"
                },
                end: {
                    dateTime: addMinutesToDate(startDate, +recipe.minutes),
                    timeZone: "Europe/Bucharest"
                },
                recurrence: [
                    "RRULE:FREQ=DAILY;COUNT=2"
                ],
                attendees: [],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: "email", minutes: 24 * 60 },
                        { method: "popup", minutes: 10 }
                    ]
                }
            })} className="primary-button">Add to calendar</button>
        </div>
    )
}

export default RecipeListItem;