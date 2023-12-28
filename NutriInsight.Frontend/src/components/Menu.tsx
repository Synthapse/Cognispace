import { useNavigate } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';
import { CgProfile } from 'react-icons/cg';
import { FaWater } from 'react-icons/fa';
import { GiWaterBottle } from 'react-icons/gi'
import { Tooltip } from "react-tooltip";
import { PiBowlFood } from 'react-icons/pi';

const MenuContainer = styled.div`
  height: 100%;
  width: 60px;
  left: 0;
  top: 0;
  position: fixed;
  border-right: 1px solid #30363d;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    height: 60px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    bottom: 0;
    top: auto;
    position: fixed;
    border-right: none;
    border-top: 1px solid #30363d;
  }
`;

const MenuItem = styled.div`
  margin: 18px 0;

  &:hover {
    cursor: pointer;

    > svg {
      color: #007bff;
    }
  }
`;

const Menu = () => {

  const navigate = useNavigate();
  const navigateToPage = (url: string) => {
    navigate(url);
  };

  const iconSize = "18px";

  return (
    <ThemeContext.Consumer>
      {theme => (
        <MenuContainer className={`menu ${theme}`}>
          <MenuItem onClick={() => navigateToPage("/mealplan")} >
            <p><GiWaterBottle style={{ fontSize: iconSize }} data-tooltip-id="tooltip-hydration" /></p>
            <Tooltip id="tooltip-hydration"
              place="right"
              content={"Hydration"}
            />
          </MenuItem>
          <MenuItem data-tooltip-id="tooltip-drink" onClick={() => navigateToPage("/water")} >
            <p><FaWater style={{ fontSize: iconSize }} /></p>
            <Tooltip id="tooltip-drink"
              place="right"
              content={"Drinks analysis"}
            />
          </MenuItem>

          <MenuItem data-tooltip-id="tooltip-fridge" onClick={() => navigateToPage("/ingredients")} >
            <p><PiBowlFood style={{ fontSize: iconSize }} /></p>
            <Tooltip id="tooltip-fridge"
              place="right"
              content={"My Fridge"}
            />
          </MenuItem>
          <MenuItem onClick={() => navigateToPage("/profile")} >
            <p><CgProfile style={{ fontSize: iconSize }} data-tooltip-id="tooltip-profile" /></p>
            <Tooltip id="tooltip-profile"
              place="right"
              content={"My Profile"}
            />
          </MenuItem>
        </MenuContainer>
      )}
    </ThemeContext.Consumer>
  );
}



export default Menu;