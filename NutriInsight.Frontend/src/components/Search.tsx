import { BsFilter } from "react-icons/bs";
import config from "../config.json"
import { Tag } from "../components/Tag";
import React, { useEffect, useRef, useState } from "react";
import { auth, readFirebaseUserData } from "../auth/firebase";
import { BsSortUp, BsSortDown } from "react-icons/bs";
import { CgSearch } from "react-icons/cg";
import axios from "axios";
import { IRecipe } from "../containers/Meal";

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
  
          if (!ingredients || !ingredients.length) {
            return;
          }
  
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


  export default Search