import React, { useState, useRef,useEffect } from "react";
import { CgSearch } from "react-icons/cg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { signInWithPopup,signOut } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "../auth/firebase";
import "../style/Mealplan.css";
import { IRecipe } from "./Meal";
import { BsSearch, BsFilter } from "react-icons/bs";
import { onAuthStateChanged } from "firebase/auth";

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
  const [priceFilter, setPriceFilter] = useState(""); 
  const [compatibilityFilter, setCompatibilityFilter] = useState("");
  const [ingredientsFilter, setIngredientsFilter] = useState("");
  const [filterOptionsVisible, setFilterOptionsVisible] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  const toggleSearch = () => {
    setExpanded(!expanded);
    setShowFilters(!showFilters);
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
        `http://localhost:8000/recipes?${queryString}`
      );
      setRecipes(response.data.recipes);
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

  const signInWithGoogle = async () => {
    try {
      const test = await signInWithPopup(auth, googleProvider);
      console.log(test);
    } catch (err) {
      console.error(err);
    }
  };

  const navigateToProfile = () => {
    navigate("/profile");
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
      if (ingredient) {
        queryParams.push(`ingredient=${ingredient}`);
      }
      if (recipeName) {
        queryParams.push(`recipe_name=${recipeName}`);
      }
      if (priceFilter) {
        queryParams.push(`price=${priceFilter}`);
      }
      if (compatibilityFilter) {
        queryParams.push(`compatibility=${compatibilityFilter}`);
      }
      if (ingredientsFilter) {
        queryParams.push(`ingredients=${ingredientsFilter}`);
      }

      const queryString = queryParams.join("&");
      const response = await axios.get(
        `http://localhost:8000/recipes?${queryString}`
      );
      setRecipes(response.data.recipes);
      console.log(response);
    } catch (error) {
      setError("Error fetching recipes");
    } finally {
      setLoading(false);
    }
  };


  // Listen for changes in authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user:any) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);
 
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <>
      <div className="navbar">
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
          />

          {expanded && (
            // @ts-ignore
            <button
              className="search-button btn"
              onClick={searchRecipes}
            >
              Search
            </button>
          )}
          {loading && <p className="loading-message">Loading...</p>}
          {error && <p className="error-message">Error: {error}</p>}
          {recipes.length > 0 && (
            <ul className="search-results">
              {recipes.map((recipe: IRecipe) => (
                <li key={recipe.id}>{recipe.name}</li>
              ))}
            </ul>
          )}
          <div
            className={`filter-icon ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <BsFilter size={23} />
          </div>

          {showFilters && (
            <div
              className={`filter-options ${showFilters ? "show-filters" : ""}`}
            >
              {/* Price filter */}
              <input
                type="text"
                placeholder="Price"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              />
              {/* Compatibility filter */}
              <input
                type="text"
                placeholder="Compatibility"
                value={compatibilityFilter}
                onChange={(e) => setCompatibilityFilter(e.target.value)}
              />
              {/* Ingredients filter */}
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
          )}
        </div>

        <div className="user-profile">
        {!user ? (
        <div className="sign-up" onClick={() => signInWithGoogle()} style={{ display: "flex" }}>
          <FcGoogle /> <p>Sign up</p>
        </div>
      )  : (
            <div className="user-info" onClick={() => navigateToProfile()}>
              <div className="user-image">
                {auth?.currentUser?.photoURL ? (
                  <img
                    src={auth?.currentUser?.photoURL ?? ""}
                    alt="User Profile"
                  />
                ) : (
                  <div className="default-user-image">
                    <p>{auth?.currentUser?.email?.charAt(0).toUpperCase()}</p>
                  </div>
                )}
              </div>
              <div className="user-details">
              <h5 className="user-name">{auth?.currentUser?.displayName}</h5>
                <p className="user-email">{auth?.currentUser?.email}</p>
                <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
              </div>
            </div>
          )}
        </div>

        
      </div>
      <div className="container">
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
      </div>
    </>
  );
};

export default Mealplan;
