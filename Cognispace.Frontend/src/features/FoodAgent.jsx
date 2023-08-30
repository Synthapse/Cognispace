import { useState, useEffect } from 'react';
import '../style/Home.css';
import { useNavigate } from 'react-router-dom';
import heroImage from '../media/heroimage.svg';
import { signInWithPopup, signOut } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "../auth/firebase";
import { onAuthStateChanged } from "firebase/auth";

const FoodAgent = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);

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

  // Listen for changes in authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
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
            <div className="row mt-4 links">
              <div className="col">
                <div className="user-profile">
                  {!user ? (
                    <div className="sign-up" onClick={() => signInWithGoogle()} style={{ display: "flex" }}>
                      <p>Sign up<FcGoogle /></p>
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
                        <button className="logout-button" onClick={handleLogout}>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <img className="hero-image" src={heroImage} />
      </div>
    </div>
  );
};

export default FoodAgent;
