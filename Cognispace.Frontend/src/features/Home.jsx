import React from 'react';
import '../style/Home.css';
import { useNavigate } from 'react-router-dom';
import heroImage from '../media/heroimage.svg';

const Home = () => {

  const navigate = useNavigate();

  const navigateToPlanMeal = () => {
    navigate('/mealplan');
  };


  return (
    <div className="container-fluid main">
      <div className="row">
        <div className="col-md-7">
          <div className="row logo">
            <div className="col">COGNISPACE</div>
          </div>
          <div className="container">
            <div className="row title-one">
              <div className="col">Food tastes better together</div>
            </div>
            <div className="row">
              <div className="col text-light">
                <p>Autonomous agent for generating recipes</p>
              </div>
            </div>
            <div className="row mt-4 links">
              <div className="col">
                <a onClick={() => navigateToPlanMeal()} className="text-light me-4 link">
                  <u>Meal plan</u>
                </a>
              </div>
            </div>
          </div>
        </div>
        <img className="hero-image" src={heroImage} />
      </div>
    </div>
  );
};

export default Home;
