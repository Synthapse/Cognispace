import { useState, useRef, useEffect } from "react";
import { CgSearch } from "react-icons/cg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/Mealplan.scss";
import { IRecipe } from "./Meal";
import { BsFilter } from "react-icons/bs";
import config from "../config.json"
import { Tag } from "../components/Tag";
import Menu from "../components/Menu";
import RecipeListItem from "../components/RecipeListItem";
import React from "react";
import { auth, readFirebaseUserData } from "../auth/firebase";
import { BsSortUp, BsSortDown } from "react-icons/bs";

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
    <div className="profile-container">
      <div className="navbar">
        <Menu />
        <Search setRecipes={setRecipes} recipes={recipes} />
      </div>

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
          {/* <button className="logout-button" onClick={() => navigate("/chat")}>
              Talk with AI
            </button> */}
          <div className="days-navigation">
            <p>Today</p>
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
    </div>
  );
};


interface ISearch {
  setRecipes: any;
  recipes: any;
}

const Search = ({ setRecipes, recipes }: ISearch) => {

  const [showFilters, setShowFilters] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const searchInputRef = useRef(null);
  const [ingredient, setIngredient] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ingredientsFilter, setIngredientsFilter] = useState("");


  const sortBySimplicity = () => {
    setRecipes(recipes.sort((a: IRecipe, b: IRecipe) => a.ingredients.length - b.ingredients.length))
    setRecipes(recipes.filter((x: IRecipe) => x))
  }

  const sortByTime = () => {
    setRecipes(recipes.sort((a: IRecipe, b: IRecipe) => +a.minutes - +b.minutes))
    setRecipes(recipes.filter((x: IRecipe) => x))
  }

  const [expanded, setExpanded] = useState(false);
  const toggleSearch = () => {
    setExpanded(!expanded);
    if (!expanded) {
      setTimeout(() => {
        // @ts-ignore
        searchInputRef?.current?.focus();
      }, 0);
    }
  };

  const selectTag = async (tag: string) => {

    selectedTags.includes(tag)
      ? setSelectedTags(selectedTags.filter(t => t !== tag))
      : setSelectedTags([...selectedTags, tag])

    setRecipes(recipes.filter((x: IRecipe) => x.tags.includes(tag)))
  }

  const applyFilters = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = [];

      if (recipeName) {
        queryParams.push(`recipe_name=${recipeName}`);
      }

      if (ingredientsFilter) {
        queryParams.push(`ingredient=${ingredientsFilter}`);
      }

      const queryString = queryParams.join("&");
      const response = await axios.get(
        `${config.apps.CognispaceAPI.url}/recipes?${queryString}`
      );
      setRecipes(response.data.recipes);
    } catch (error) {
      setError("Error fetching recipes");
    } finally {
      setLoading(false);
    }
  };


  const searchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = [];
      if (ingredient) {
        queryParams.push(`ingredient=${ingredient}`);
      }

      if (userIngredients) {
        const ingredientQueryParams = userIngredients.map(ingredient => `ingredients=${encodeURIComponent(ingredient)}`);
        queryParams.push(...ingredientQueryParams);
      }


      if (recipeName) {
        queryParams.push(`recipe_name=${recipeName}`);
      }

      const queryString = queryParams.join("&");
      const response = await axios.get(
        `${config.apps.CognispaceAPI.url}/recipes?${queryString}`
      );

      setRecipes(response.data.recipes);
      setTags(Array.from(new Set(response.data.recipes.flatMap((x: { tags: string; }) => x.tags))))

    } catch (error) {
      setError("Error fetching recipes");
    } finally {
      setLoading(false);
    }
  };

  const [userIngredients, setUserIngredients] = useState([])

  const fetchUserIngredients = async () => {
    if (auth.currentUser) {
      try {
        const ingredients = await readFirebaseUserData(auth.currentUser.uid, "ingredients");
        setUserIngredients(ingredients[0].ingredients)
        console.log(ingredients);
        setLoading(false)
      } catch (error) {
        console.log("Error fetching history data: ", error);
      }
    }
  };


  useEffect(() => {
    fetchUserIngredients();
  }, [])


  const navigateToHydration = () => {
    window.location.href = '/#hydration'
  }


  const [useUserIngredients, setUseUserIngredients] = React.useState(false);

  const handleChange = () => {
    setUseUserIngredients(!useUserIngredients);
  };

  return (
    <div>
      <div className="search-filters">
        <div className={`search-container mt-3 ${expanded ? "expanded" : ""}`}>
          <div className="search-icon">
            <CgSearch size={23} />
          </div>
          <input
            type="text"
            className="search-input"
            style={{ width: expanded ? "150px" : "0" }}
            onBlur={() => {
              // @ts-ignore
              if (!searchInputRef?.current?.value.trim()) {
                setExpanded(false);
              }
            }}
            ref={searchInputRef}
            placeholder="Recipes"
            value={expanded ? ingredient : ""}
            onChange={(e) => setIngredient(e.target.value)}
            onClick={toggleSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                toggleSearch();
                searchRecipes();
              }
            }}
          />

          {expanded && (
            <button
              className="search-button btn"
              onClick={searchRecipes}
            >
              Search
            </button>
          )}
          <div
            className={`filter-icon ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <BsFilter size={23} />
          </div>
          {loading && <p className="loading-message">Loading...</p>}
          {error && <p className="error-message">Error: {error}</p>}
        </div>
      </div>
      {showFilters && (
        <>
          <div className={`filter-options`}>

            <label>
              <input
                type="checkbox"
                checked={useUserIngredients}
                onChange={handleChange}
              />
              Include my ingredients ({userIngredients.map((x: string) => {
                return (
                  <p>{x}, </p>
                )
              })}
              )
            </label>

            {tags.length > 0 &&
              <>
                <h3>Tags:</h3>
                <div className="tags">{tags.map((x: string) => <Tag onClick={() => selectTag(x)} text={x} isActive={selectedTags.includes(x)} />)}</div>
              </>
            }


            <h3>Ingredients:</h3>
            <input
              type="text"
              placeholder="Ingredients"
              value={ingredientsFilter}
              onChange={(e) => setIngredientsFilter(e.target.value)}
            />
            {/* Add filter button */}
            <button className="apply-filters-btn" onClick={applyFilters}>
              Apply Filters
            </button>
            <div onClick={() => sortBySimplicity()}>
              <BsSortUp size={23} />
              Sort by simplicity
            </div>
            <div onClick={() => sortByTime()}>
              <BsSortUp size={23} />
              Sort by Time
            </div>
          </div>
        </>
      )
      }
    </div >
  )
}


export default Mealplan;
