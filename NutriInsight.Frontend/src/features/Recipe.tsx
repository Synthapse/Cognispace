import { useLocation } from "react-router-dom";
import { IRecipe } from "./Meal";
import { useEffect, useState } from "react";
import { auth, readFirebaseUserData } from "../auth/firebase";

import "../style/recipe.scss";


const Recipe = () => {

    const location = useLocation();

    const recipe: IRecipe = location.state.recipe;
    const [userIngredients, setUserIngredients] = useState<any>([])

    const fetchUserIngredients = async () => {
        if (auth.currentUser) {
            try {
                const ingredients = await readFirebaseUserData(auth.currentUser.uid, "ingredients");
                setUserIngredients(ingredients[0].ingredients)
                console.log(ingredients);
            } catch (error) {
                console.log("Error fetching history data: ", error);
            }
        }
    };

    useEffect(() => {
        fetchUserIngredients();
    }, [])

    return (
        <>
            {recipe &&
                <>
                    <h1>{recipe.name}</h1>
                    <p>{recipe.description}</p>
                    <hr />
                    <b>Ingredients:</b>
                    {recipe.ingredients.map((ingredient: string) => {
                        return (
                            <li className ={userIngredients.includes(ingredient) ? 'green' : 'red'}>
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