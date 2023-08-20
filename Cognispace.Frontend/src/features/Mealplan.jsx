import React, { useState, useRef } from 'react';
import { CgSearch } from 'react-icons/cg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../style/Mealplan.css';


const meals = [
  {
    id: 1,
    name: 'Breakfast',
  },
  {
    id: 2,
    name: 'Brunch',
  },
  {
    id: 3,
    name: 'Dinner',
  },
  {
    id: 4,
    name: 'Dessert',
  },
  {
    id: 4,
    name: 'Supper',
  },
  {
    id: 5,
    name: 'Drinks',
  }
]

const Mealplan = () => {
  const [expanded, setExpanded] = useState(false);
  const searchInputRef = useRef(null);

  const [ingredient, setIngredient] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSearch = () => {
    setExpanded(!expanded);
    if (!expanded) {
      setTimeout(() => {
        searchInputRef.current.focus();
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

      const queryString = queryParams.join('&');
      const response = await axios.get(`http://localhost:8000/recipes?${queryString}`);
      setRecipes(response.data.recipes);
    } catch (error) {
      setError('Error fetching recipes');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();


  const navigateToMeal = (meal) => {
    navigate('/meal', { state: { meal: meal } })
  };

  return (
    <>
      <div className={`search-container mt-3 ${expanded ? 'expanded' : ''}`}>
        <div className="search-icon">
          <CgSearch size={23} />
        </div>
        <input
          type="text"
          className="search-input"
          style={{ width: expanded ? '150px' : '0' }}
          onBlur={() => {
            if (!searchInputRef.current.value.trim()) {
              setExpanded(false);
            }
          }}
          ref={searchInputRef}
          placeholder="Recipes"
          value={expanded ? ingredient : ''}
          onChange={(e) => setIngredient(e.target.value)}
          onClick={toggleSearch}
        />

        {expanded && (
          <button className="search-button btn" size={200} onClick={searchRecipes}>
            Search
          </button>
        )}
        {loading && <p className="loading-message">Loading...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        {recipes.length > 0 && (
          <ul className="search-results">
            {recipes.map((recipe) => (
              <li key={recipe.id}>{recipe.name}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="container">
        <div className="head d-flex mb-3">
          <div className="section-1">Today</div>
          <div className="ms-5 section-2">Tomorrow</div>
        </div>

        <ul className="list-unstyled mt-5">
          {meals.map((meal) => (
            <li onClick={() => navigateToMeal(meal.name)} key={meal.id}>{meal.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Mealplan;
