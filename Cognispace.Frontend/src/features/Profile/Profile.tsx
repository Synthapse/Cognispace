import { auth } from "../../auth/firebase";
import '../../style/main.scss'
import Menu from "../../components/Menu";

export const Profile = () => {

    return (
        <div className="profile-container">
            <Menu />
            <img style={{ borderRadius: '50%', width: '72px', height: '72px' }} src={auth?.currentUser?.photoURL ?? ""} />
            <h3>{auth?.currentUser?.displayName}</h3>
            <p>{auth?.currentUser?.email}</p>
        </div>
    );
};