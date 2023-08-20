import React, { useState, useRef } from 'react';
import { CgSearch } from 'react-icons/cg';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../style/Meal.css';
import useFetch from '../hooks/useFetch';

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
          <div className="recipe-container">
            <h2>{recipe.name}</h2>
            <p>{recipe.description}</p>
            <br/>
            {recipe.ingredients.map((y: string) => {
              return (
                <li>{y}</li>
              )
            })}
          </div>
        )
      })}
    </div>
  );
};

export default Meal;
