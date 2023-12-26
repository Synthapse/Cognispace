import { useState } from "react"
import { IWizzardStep, WizardChoiceContainer, WizzardChoice, WizzardChoices } from "./utils"

const ActivityLevel = ({ profileDetailsData, setProfileDetailsData }: IWizzardStep) => {


    const activityLevels = [
        {
            title: "Sedentary",
            subTitle: "Little or not"
        },
        {
            title: "Lightly active",
            subTitle: "Light exercise or sports 1-3 days a week"
        },
        {
            title: "Moderately active",
            subTitle: "Moderate exercise or sports 3-5 days a week"
        },
        {
            title: "Very active",
            subTitle: "Hard exercise or sports 6-7 days a week"
        },
        {
            title: "Super Active",
            subTitle: "More than 6-7 days a week"
        }
    ]

    const [selectedActiveLevel, setSelectedActiveLevel] = useState<string>(profileDetailsData.activityLevel)

    const selectActivityLevel = (value: string) => {
        setSelectedActiveLevel(value)
        setProfileDetailsData((prevState: any) => {
            if (prevState) {
                return {
                    ...prevState,
                    activityLevel: value
                }
            }
            return null;
        })
    }

    return (
        <WizardChoiceContainer>
            <h2>Activity Level</h2>
            <WizzardChoices>
                {activityLevels.map((level) => (
                    <WizzardChoice enriched={selectedActiveLevel === level.title} onClick={() => selectActivityLevel(level.title)}>
                        <h4>{level.title}</h4>
                        <p>{level.subTitle}</p>
                    </WizzardChoice>
                ))}
            </WizzardChoices>
        </WizardChoiceContainer>
    )
}

export default ActivityLevel;