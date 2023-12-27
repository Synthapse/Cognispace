import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import Menu from '../components/Menu';
import { auth, readFirebaseUserData } from '../auth/firebase';
import { Container, WaterGlass } from "./Water";
import { calculateLongestConsecutiveStreak } from "../../src/utils";
import { DocumentData } from "firebase/firestore";
import styled from "styled-components";
import { PrimaryButton } from "../App";
import ProfileWizzard from "./Wizzard/ProfileWizzard";


const Streaks = styled.div`
    display:flex;
`

const Streak = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-right: 20px;
`

export const Profile = () => {

    const [user, setUser] = useState(auth.currentUser);
    const [profileData, setProfileData] = useState<any>();
    const [wizzardProcessing, setWizzardProcessing] = useState<boolean>(false);
    const [streaks, setStreaks] = useState<number[]>([0, 0]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };


    const readDrinksStats = async () => {

        const waterStats = await readFirebaseUserData(auth?.currentUser?.uid ?? "", "drinkstats")
        const sortedWaterStats = waterStats[0].dates.sort((a: DocumentData, b: DocumentData) => new Date(b.date).getTime() - new Date(a.date).getTime())
        const streak = calculateLongestConsecutiveStreak(sortedWaterStats.map((x: { date: any; }) => x.date));
        setStreaks([streak[0], streak[1]]);
    }

    const readProfileData = async () => {
        const profileData = await readFirebaseUserData(auth?.currentUser?.uid, "userProfile");
        setProfileData(profileData[0].profileData)
    }

    useEffect(() => {
        readDrinksStats()
        readProfileData()
    }, [setWizzardProcessing])


    return (
        <Container>
            <Menu />
            {wizzardProcessing

                ?
                <ProfileWizzard profileData={profileData} setWizzardProcessing={setWizzardProcessing} />
                :
                <>
                    <h2>Welcome, {auth?.currentUser?.displayName}</h2>
                    {profileData && <>
                        <div>
                            <p>Age: {profileData?.basicInformation?.age}</p>
                            <p>Gender: {profileData?.basicInformation?.gender}</p>
                            <p>Weight: {profileData?.basicInformation?.weight}</p>
                        </div>
                        <div>
                            <p>Activity Level: {profileData.activityLevel}</p>
                            <p>Goals: {profileData.goals}</p>
                            <p>Preferable Drink: {profileData.preferableDrink}</p>
                        </div>
                    </>}
                    <Streaks>
                        <Streak>
                            <WaterGlass>
                                {streaks[0]}
                            </WaterGlass>
                            longest streak
                        </Streak>

                        <Streak>
                            <WaterGlass>
                                {streaks[1]}
                            </WaterGlass>
                            current streak
                        </Streak>
                    </Streaks>
                    <PrimaryButton className="logout-button" onClick={() => setWizzardProcessing((prev) => !prev)}>
                        Start Wizzard
                    </PrimaryButton>

                    <PrimaryButton className="logout-button" onClick={handleLogout}>
                        Logout
                    </PrimaryButton>
                </>
            }

        </Container>
    );
};