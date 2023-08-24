import { useLocation } from "react-router-dom";
import { IRecipe } from "./Meal";



const Recipe = () => {

    const location = useLocation();

    const recipe: IRecipe = location.state.recipe;

    return (
        <>
            {recipe &&
                <>
                    <h1>{recipe.name}</h1>
                    <p>{recipe.description}</p>
                    <hr />
                    <b>Ingredients:</b>
                    {recipe.ingredients.map((ingredient) => {
                        return (
                            <li>
                                {ingredient}
                            </li>
                        )
                    })}
                    <b>Steps:</b>
                    {recipe.steps.map((step) => {
                        return (
                            <li>
                                {step}
                            </li>
                        )
                    })
                    }
                </>
            }
        </>
    )
}

export default Recipe;