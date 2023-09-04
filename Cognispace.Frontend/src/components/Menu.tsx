
import './menu.scss'
import { PiBowlFood } from 'react-icons/pi';
import { BsCalendar3 } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { PiCookingPotBold } from 'react-icons/pi';
import { ThemeContext } from '../App';
import { LuGlassWater } from "react-icons/lu";

const Menu = () => {

    const navigate = useNavigate();
    const navigateToPage = (url: string) => {
        navigate(url);
    };

    const iconSize = '24px';

    return (
        <ThemeContext.Consumer>
            {theme => (
                <div className={`menu ${theme}`}>
                    <div onClick={() => navigateToPage("/mealplan")} className="menu-item">
                        <p><PiCookingPotBold style={{ fontSize: iconSize }} /></p>
                    </div>
                    <div onClick={() => navigateToPage("/ingredients")} className="menu-item">
                        <p><PiBowlFood style={{ fontSize: iconSize }} /></p>
                    </div>
                    <div onClick={() => navigateToPage("/water")} className="menu-item">
                        <p><LuGlassWater style={{ fontSize: iconSize }} /></p>
                    </div>
                    <div onClick={() => navigateToPage("/profile")} className="menu-item">
                        <p><CgProfile style={{ fontSize: iconSize }} /></p>
                    </div>
                </div>)}
        </ThemeContext.Consumer>
    )
}

export default Menu;