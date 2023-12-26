import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

export const WizardChoiceContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    `

export const WizzardChoices = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 20px;

`

export interface WizzardChoiceProps {
    enriched: boolean;
}

export interface IProfileData {
    basicInformation: {
        age: number;
        gender: string | null;
        weight: number;
    },
    activityLevel: string;
    preferableDrink: string;
    goals: string[];
}

export interface IWizzardStep {
    setProfileDetailsData: Dispatch<SetStateAction<IProfileData>>;
    profileDetailsData: IProfileData;
}

export const Wizzard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
`


export const WizzardChoice = styled.div<WizzardChoiceProps>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 220px;
    text-align:center;
    width: 140px;
    border: 1px solid ${({ theme, enriched }) => (enriched ? 'blue' : theme.toggleBorder)};
    margin: 0 10px;
    padding: 10px;
    transition: 0.5s;

    &:hover {
        cursor: pointer;
        border: 1px solid blue;
    }
    transition: 0.5s;
`
