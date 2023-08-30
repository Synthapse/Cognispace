import { BiTimer } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { IRecipe } from "../features/Meal";
import { BsBarChartSteps } from "react-icons/bs";
import { PiBowlFood } from "react-icons/pi";
import { Tag } from "./Tag";

import "./listitem.scss"

const RecipeListItem = ({ recipe }: { recipe: IRecipe }) => {

    const navigate = useNavigate();

    const navigateToRecipe = () => {
        navigate("/recipe", { state: { recipe: recipe } });
    };

    return (
        <div onClick={() => navigateToRecipe()} className="recipe-list-item">
            <h2 key={recipe.id}>{recipe.name}</h2>
            <div className="recipe-list-item-details">
                <p><BiTimer size={18} /> {recipe.minutes} min</p>
                <p><BsBarChartSteps size={18} /> {recipe.steps.length} steps</p>
                <p><PiBowlFood size={18} /> {recipe.ingredients.length} ingredients</p>
            </div>
            <div className="tags">{recipe.tags.map(x => <Tag text={x} />)}</div>
        </div>
    )
}

export default RecipeListItem;