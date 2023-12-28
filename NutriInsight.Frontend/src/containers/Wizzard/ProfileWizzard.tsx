import { useState } from "react";
import BasicInformation from "./BasicInformation";
import ActivityLevel from "./ActivityLevel";
import PreferrableDrink from "./PrefferableDrink";
import Goals from "./Goals";
import { ProgressBar } from "../../charts/ProgressBar";
import { IProfileData, Wizzard } from "./utils";
import { PrimaryButton } from "../../App";
import styled from "styled-components";
import { auth, writeUserProfileData } from "../../auth/firebase";
import { profile } from "console";

const UIControls = styled.div`
    margin-top: 20px;
    display: flex;
    > button {
        margin: 0 20px;
    }
    `


interface IProfileWizzard {
    profileData: IProfileData;
    setWizzardProcessing: any;
}

const ProfileWizzard = ({ profileData, setWizzardProcessing }: IProfileWizzard) => {

    const [activeProgress, setActiveProgress] = useState(0);
    const [profileDetailsData, setProfileDetailsData] = useState<IProfileData>({
        basicInformation: {
            age: profileData?.basicInformation.age ?? 0,
            gender: profileData?.basicInformation.gender ?? "male",
            weight: profileData?.basicInformation.weight ?? 0,
        },
        activityLevel: profileData?.activityLevel ?? "",
        preferableDrink: profileData?.preferableDrink ?? "",
        goals: profileData?.goals ?? []
    })


    const WizzardSteps = [
        {
            stepName: "Basic Information",
            component: <BasicInformation profileDetailsData={profileDetailsData} setProfileDetailsData={setProfileDetailsData} />
        },
        {
            stepName: "Activity Level",
            component: <ActivityLevel profileDetailsData={profileDetailsData} setProfileDetailsData={setProfileDetailsData} />
        },
        {
            stepName: "Preferrable Drink",
            component: <PreferrableDrink profileDetailsData={profileDetailsData} setProfileDetailsData={setProfileDetailsData} />
        },
        {
            stepName: "Goals",
            component: <Goals profileDetailsData={profileDetailsData} setProfileDetailsData={setProfileDetailsData} />
        }
    ];

    const saveProfileData = () => {
        setWizzardProcessing(false);
        writeUserProfileData(auth?.currentUser?.uid, profileDetailsData)
    }

    const checkDisabled = () => {


        if (activeProgress >= WizzardSteps.length - 1) {
            return true;
        }

        if (profileDetailsData.basicInformation.age == 0 || profileDetailsData.basicInformation.gender == null || profileDetailsData.basicInformation.weight == 0 && activeProgress == 0) {
            return true;
        }

        if (profileDetailsData.activityLevel == "" && activeProgress == 1) {
            return true;
        }

        if (profileDetailsData.preferableDrink == "" && activeProgress == 2) {
            return true;
        }

        if (profileDetailsData.goals.length && activeProgress == 3) {
            return true;
        }

        return false;
    }

    return (
        <>
            <Wizzard>
                <ProgressBar completed={activeProgress * 100 / WizzardSteps.length + 1} />
                {WizzardSteps[activeProgress].component}

                <UIControls>
                    <PrimaryButton onClick={() => setActiveProgress(activeProgress > 0 ? activeProgress - 1 : activeProgress)}>Return</PrimaryButton>
                    {activeProgress == WizzardSteps.length - 1
                        ? <PrimaryButton onClick={saveProfileData}>Save</PrimaryButton>
                        : <PrimaryButton disabled={checkDisabled()} onClick={() => setActiveProgress(activeProgress + 1)}>Next Step</PrimaryButton >
                    }
                </UIControls>
            </Wizzard>
        </>
    )
}

export default ProfileWizzard;
