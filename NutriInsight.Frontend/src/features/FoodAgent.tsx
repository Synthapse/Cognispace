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
  align-items: center;
  padding: 20px;
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0;
`


const FoodAgent = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);

  const signInWithGoogle = async () => {
    try {
      const test = await signInWithPopup(auth, googleProvider);
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


      <TextContainer>
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome in NutriInsight!</h2>
        <h1>Savor the Symphony of Nature</h1>
        <p>Elevate Your Tastebuds with Our Premium
          Natural Agriculture Food and Water</p>
        {!user ? (
          <div className="sign-up" onClick={() => signInWithGoogle()} style={{ display: "flex" }}>
            <FcGoogle style={{ fontSize: '18px' }} /><p>Sign up</p>
          </div>
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
      <img className="hero-image" src={heroImage} />
    </MainContainer>
  );
};

export default FoodAgent;
