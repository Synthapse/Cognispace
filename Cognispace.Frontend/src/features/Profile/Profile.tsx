import { auth } from "../../auth/firebase";
import '../../style/main.scss'
import Menu from "../../components/Menu";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { IMeal, meals } from "../Mealplan";

export const Profile = () => {

    const [user, setUser] = useState(auth.currentUser);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="profile-container">
            <Menu />
            <img style={{ borderRadius: '50%', width: '72px', height: '72px' }} src={auth?.currentUser?.photoURL ?? ""} />
            <h3>{auth?.currentUser?.displayName}</h3>
            <p>{auth?.currentUser?.email}</p>

            {meals.map((meal: IMeal) => {
                return (
                    <div>
                        <p>{meal.name} time:</p>
                        <p>{meal.time}</p>
                    </div>
                )
            })}

            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};