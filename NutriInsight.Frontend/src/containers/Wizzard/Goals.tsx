import { useState } from "react"
import { IWizzardStep, WizardChoiceContainer, WizzardChoice, WizzardChoices } from "./utils"

const Goals = ({ profileDetailsData, setProfileDetailsData }: IWizzardStep) => {

    const [selectedGoals, setSelectedGoals] = useState<string>(profileDetailsData.preferableDrink)

    const selectGoal = (value: string) => {
        setSelectedGoals(value)
        setProfileDetailsData((prevState: any) => {
            if (prevState) {
                return {
                    ...prevState,
                    goals: value
                }
            }
            return null;
        })
    }


    const goals = [
        {
            title: "Daily Water Intake Goal",
            subTitle: "Set and track daily water intake"
        },
        {
            title: "Health and Fitness Goals",
            subTitle: "Improve skin health, support weight loss, enhance workouts"
        },
        {
            title: "Hydration Habit Formation",
            subTitle: "Establish a consistent water-drinking habit"
        },
        {
            title: "Medical and Health Condition Management",
            subTitle: "Monitor and maintain hydration for medical conditions"
        },
        {
            title: "Weather-Dependent Hydration",
            subTitle: "Adjust water intake based on weather conditions"
        }
    ];

    return (
        <WizardChoiceContainer>
            <h2>Goals</h2>
            <WizzardChoices>
                {goals.map((goal) => (
                    <WizzardChoice enriched={selectedGoals === goal.title} onClick={() => selectGoal(goal.title)}>
                        <h4>{goal.title}</h4>
                        <p>{goal.subTitle}</p>
                    </WizzardChoice>
                ))}
            </WizzardChoices>
        </WizardChoiceContainer>
    )
}

export default Goals;