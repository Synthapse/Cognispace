import '../style/Home.css';
import { useNavigate } from 'react-router-dom';
import heroImage from '../media/autonomousagents.svg';

const Home = () => {

  const navigate = useNavigate();

  const navigateToPlanMeal = () => {
    navigate('/food');
  };


  return (
    <div className="container-fluid main black">
      <div className="row">
        <div className="col-md-7">
          <div className="row logo">
            <div className="col">COGNISPACE</div>
          </div>
          <div className="container">
            <div className="row title-one">
              <div className="col">Autonomous space<br />
                for cognitive AI agents.</div>
            </div>
            <div className="row mt-4 links">
              <div className="col">
                <a onClick={() => navigateToPlanMeal()} className="text-light me-4 link">
                  <u>Food Agent</u>
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