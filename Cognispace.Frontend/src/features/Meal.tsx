import { useLocation } from 'react-router-dom';
import '../style/Meal.css';
import useFetch from '../hooks/useFetch';
import RecipeListItem from '../components/RecipeListItem';

export interface IRecipe {
  name: string;
  id: number;
  minutes: string;
  contributor_id: string;
  submitted: string;
  tags: string[];
  nutrition: string;
  n_steps: string;
  steps: string[];
  description: string;
  ingredients: string[];
  n_ingredients: string;
}


const Meal = () => {

  const location = useLocation();

  const url = `http://localhost:8000/recipesByMeal?meal=${location.state.meal}`
  const { data, error } = useFetch(url)

  return (
    <div className="container">
      <h1>{location.state.meal}</h1>
      {data?.map((recipe: IRecipe) => {
        return (
          <RecipeListItem recipe={recipe} meal={location.state.meal} />
        )
      })}
    </div>
  );
};

export default Meal;
