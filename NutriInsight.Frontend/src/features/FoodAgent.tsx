import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg';
import heroImage from '../../src/media/hero.jpg';
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "../auth/firebase";
import { onAuthStateChanged } from "firebase/auth";
import styled from 'styled-components';

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  h1 {
    color: #005F80;
    padding: 0;
    margin: 18px 0 18px 0;
  }

  h2 {
    color: #4DAED0;
    padding: 0;
    margin: 32px 0 0px 0;
    font-family: Gilroy-Regular;
  }

  p {
    color: #005F80;
    padding: 0;
    margin: 0;
  }
`

const PresentationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 60%;
  padding: 0 0 0 18px;
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10vh;
`

const MainImage = styled.img`
  width: 40%;
  height: 100vh;
  object-fit: cover;
`

const SignUp = styled.div`
  display: flex;
  margin-top: 24px;
  flex-direction: row;
  border: 1px solid #4DAED0;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  font-family: Gilroy-Medium;
  transition: 0.2s;
  &:hover {
    cursor: pointer;
    border: 1px solid #005F80;
    transition: 0.2s;
  }
`

const Logo = styled.img`
  width: 85px;
  height: 85px;
  margin: 24px 0 0 0;
  padding: 0;
`


const FoodAgent = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const navigateToProfile = () => {
    navigate("/profile");
  };

  // Listen for changes in authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);



  return (
    <MainContainer>

      <PresentationContainer>
        <Logo src={logo} className="App-logo" alt="logo" />
        <TextContainer>
          <h2>Welcome in NutriInsight!</h2>
          <h1>Savor the Symphony of Nature</h1>
          <p>Elevate Your Tastebuds with our<br/>
            Natural Agriculture Food and Water</p>
          {!user ? (
            <SignUp onClick={() => signInWithGoogle()} style={{ display: "flex" }}>
              <FcGoogle style={{ fontSize: '18px' }} /><p>Sign up</p>
            </SignUp>
          ) : (
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
                <button className="logout-button">
                  View Profile
                </button>
              </div>
            </div>
          )}
        </TextContainer>
      </PresentationContainer>
      <MainImage src={heroImage} />
    </MainContainer>
  );
};

export default FoodAgent;
