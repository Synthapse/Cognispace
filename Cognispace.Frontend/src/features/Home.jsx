import React from 'react';
import '../style/Home.css';

const Home = () => {
  return (
    <div className="container-fluide main">
      <div className="row">
        <div className="col-md-7">
          <div className="row logo">
            <div className="col">COGNISPACE</div>
          </div>
          <div className="middle-text">
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
                <a href="#" className="text-light me-4">
                  <u>Register</u>
                </a>
                <a href="#" className="text-light">
                  <u>How it Works?</u>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
