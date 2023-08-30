
import './menu.scss'
import { PiBowlFood } from 'react-icons/pi';
import { BsCalendar3 } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { GrPlan } from 'react-icons/gr';

const Menu = () => {

    const navigate = useNavigate();

    const navigateToPage = (url: string) => {
        navigate(url);
    };

    const iconSize = '24px';

    return (
        <div className="menu">
            <div onClick={() => navigateToPage("/mealplan")} className="menu-item">
                <p><GrPlan style={{ fontSize: iconSize }} /></p>
            </div>
            <div onClick={() => navigateToPage("/ingredients")} className="menu-item">
                <p><PiBowlFood style={{ fontSize: iconSize }} /></p>
            </div>
            <div onClick={() => navigateToPage("/calendar")} className="menu-item">
                <p><BsCalendar3 style={{ fontSize: iconSize }} /></p>
            </div>
            <div onClick={() => navigateToPage("/profile")} className="menu-item">
                <p><CgProfile style={{ fontSize: iconSize }} /></p>
            </div>
        </div>
    )
}

export default Menu;