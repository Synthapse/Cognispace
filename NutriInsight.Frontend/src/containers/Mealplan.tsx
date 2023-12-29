import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IRecipe } from "./Meal";
import Menu from "../components/Menu";
import RecipeListItem from "../components/RecipeListItem";
import Search from "../components/Search";
import { Container } from "./Water";
import TopMealOfDay from "../widgets/TopOfDay";


export interface IMeal {
  id: number;
  name: string;
  time: number;
}

export const meals: IMeal[] = [
  {
    id: 1,
    name: "Breakfast",
    time: 8,
  },
  {
    id: 2,
    name: "Brunch",
    time: 11,
  },
  {
    id: 3,
    name: "Dinner",
    time: 14,
  },
  {
    id: 4,
    name: "Dessert",
    time: 15,
  },
  {
    id: 4,
    name: "Supper",
    time: 18,
  },
  {
    id: 5,
    name: "Drinks",
    time: 24,
  },
];

const Mealplan = () => {


  const [recipes, setRecipes] = useState([]);


  const navigate = useNavigate();

  const navigateToMeal = (meal: string) => {
    navigate("/meal", { state: { meal: meal } });
  };

  const navigateToPage = (page: string) => {
    navigate(page);
  }

  const currentDateTime = new Date();
  const targetTime = new Date();

  const isAfter = (hour: number) => {
    return targetTime.setHours(hour, 0, 0, 0) < currentDateTime.getTime();
  };

  useEffect(() => {
    console.log('test')
  }, [recipes])


  return (
    <Container>
      <div className="navbar">
        <Menu />
        <Search setRecipes={setRecipes} recipes={recipes} />
      </div>

      {recipes.length && <TopMealOfDay recipe={recipes[0]} />}

      {recipes.length ?
        recipes.length > 0 && (
          <ul className="search-results">
            {recipes.map((recipe: IRecipe) => (
              <RecipeListItem recipe={recipe} />
            ))}
          </ul>
        )
        :
        <>
          <div className="days-navigation">
            <div onClick={() => navigateToPage("/hydration")} className="ms-5 section-2">Water</div>
          </div>

          <ul className="list-unstyled mt-5">
            {meals.map((meal) => (
              <li
                className={isAfter(meal.time) ? "line" : ""}
                onClick={() => navigateToMeal(meal.name)}
                key={meal.id}
              >
                {meal.name}
              </li>
            ))}
          </ul>
        </>
      }
    </Container>
  );
};




export default Mealplan;
