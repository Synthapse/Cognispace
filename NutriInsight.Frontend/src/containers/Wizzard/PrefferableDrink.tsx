import { useState } from "react"
import { IWizzardStep, WizardChoiceContainer, WizzardChoice, WizzardChoices } from "./utils"
import { drinks } from "../Hydration"


const PreferrableDrink = ({ profileDetailsData, setProfileDetailsData }: IWizzardStep) => {

    const [selectedPreferableDrink, setSelectedPreferableDrink] = useState<string>(profileDetailsData.preferableDrink)

    const selectPrefferableDrink = (value: string) => {
        setSelectedPreferableDrink(value)
        setProfileDetailsData((prevState: any) => {
            if (prevState) {
                return {
                    ...prevState,
                    preferableDrink: value
                }
            }
            return null;
        })
    }

    return (
        <WizardChoiceContainer>
            <h2>Preferrable Drink</h2>
            <WizzardChoices>
                {drinks.map((drink: string) => (
                    <WizzardChoice enriched={selectedPreferableDrink === drink} onClick={() => selectPrefferableDrink(drink)}>
                        <h4>{drink}</h4>
                    </WizzardChoice>
                ))}
            </WizzardChoices>
        </WizardChoiceContainer>
    )
}

export default PreferrableDrink;