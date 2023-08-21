import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import { useNavigate } from 'react-router-dom';
import { IoIosReturnLeft } from "react-icons/io";

export const Profile = () => {

    const navigate = useNavigate();

    const logOut = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ paddingTop: '5%', paddingLeft: ' 70px' }}>
            <div onClick={() => navigate(-1)} style={{ display: 'flex' }}> <IoIosReturnLeft style={{ fontSize: '24px ' }} /><p style={{ fontSize: '12px' }}>return </p></div>
            <img style={{ borderRadius: '50%', width: '72px', height: '72px' }} src={auth?.currentUser?.photoURL ?? ""} />
            <h3>{auth?.currentUser?.displayName}</h3>
            <p>{auth?.currentUser?.email}</p>
            <hr /><br/><br/>
            <h4>My Ingredients:</h4>

            Milk, eggs, tomato, strawberries
        </div>
    );
};