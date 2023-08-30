import { useState, useRef } from "react";
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

const meals = [
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
  const [expanded, setExpanded] = useState(false);
  const searchInputRef = useRef(null);

  const [ingredient, setIngredient] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [ingredientsFilter, setIngredientsFilter] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleSearch = () => {
    setExpanded(!expanded);
    if (!expanded) {
      setTimeout(() => {
        // @ts-ignore
        searchInputRef?.current?.focus();
      }, 0);
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
      if (recipeName) {
        queryParams.push(`recipe_name=${recipeName}`);
      }

      const queryString = queryParams.join("&");
      const response = await axios.get(
        `${config.apps.CognispaceAPI.url}/recipes?${queryString}`
      );
      setRecipes(response.data.recipes);

      setTags(Array.from(new Set(response.data.recipes.flatMap((x: { tags: string; }) => x.tags))))
      console.log(response);
    } catch (error) {
      setError("Error fetching recipes");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const navigateToMeal = (meal: string) => {
    navigate("/meal", { state: { meal: meal } });
  };

  const currentDateTime = new Date();
  const targetTime = new Date();

  const isAfter = (hour: number) => {
    return targetTime.setHours(hour, 0, 0, 0) < currentDateTime.getTime();
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = [];

      if (recipeName) {
        queryParams.push(`recipe_name=${recipeName}`);
      }
      //24.08 - find issue to make price & compatibility works
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

  const selectTag = async (tag: string) => {

    selectedTags.includes(tag)
      ? setSelectedTags(selectedTags.filter(t => t !== tag))
      : setSelectedTags([...selectedTags, tag])

    setRecipes(recipes.filter((x: IRecipe) => x.tags.includes(tag)))

  }

  return (
    <div className="profile-container">
      <div className="navbar">
        <Menu />
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
      </div>
      {showFilters && (
        <>
          <div className={`filter-options`}>
            <h3>Tags:</h3>
            <div className="tags">{tags.map((x: string) => <Tag onClick={() => selectTag(x)} text={x} isActive={selectedTags.includes(x)} />)}</div>
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
          </div>
        </>
      )}
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
            <div className="ms-5 section-2">Tomorrow</div>
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


export default Mealplan;
