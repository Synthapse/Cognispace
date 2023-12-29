import styled from "styled-components"
import { IRecipe } from "../containers/Meal"



const TopMealOfDayContainer = styled.div`
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 16px;
    padding:24px;
    width: 25%;
`

const TopMealOfDay = ({ recipe }: any) => {

    return (
        <TopMealOfDayContainer>
            <h2>{recipe.name}</h2>
            <p>{recipe.description}</p>
        </TopMealOfDayContainer>
    )
}


export default TopMealOfDay