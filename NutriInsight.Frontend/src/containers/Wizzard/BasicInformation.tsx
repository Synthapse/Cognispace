import { useState } from "react";
import { IWizzardStep } from "./utils"
import Slider from "../../components/Slider";


const BasicInformation = ({ profileDetailsData, setProfileDetailsData }: IWizzardStep) => {


    const [age, setAge] = useState(profileDetailsData.basicInformation.age);
    const [gender, setGender] = useState<string | null>(profileDetailsData.basicInformation.gender);
    const [weight, setWeight] = useState(profileDetailsData.basicInformation.weight);


    const updateProfileData = (field: string, value: string) => {

        // Update the state based on the field parameter
        switch (field) {
            case "age":
                setAge(parseInt(value));
                break;
            case "gender":
                setGender(value);
                break;
            case "weight":
                setWeight(parseInt(value));
                break;
            default:
                break;
        }

        setProfileDetailsData((prevState: any) => {
            if (prevState) {
                return {
                    ...prevState,
                    basicInformation: {
                        ...prevState.basicInformation,
                        [field]: value
                    }
                };
            }
            return null;
        });
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGender = e.target.value;
        updateProfileData("gender", selectedGender);
    };

    return (
        <>
            <h2>Basic Information</h2>
            <p>Age ({age} years):</p>
            <Slider step={1} min={16} max={75} value={age} setValue={(e: any) => updateProfileData("age", e)} />
            <p>Weight ({weight} kg):</p>
            <Slider step={1} min={50} max={155} value={weight} setValue={(e: any) => updateProfileData("weight", e)} />
            <p>Gender:</p>
            <select id="gender" value={gender ?? 'male'} onChange={handleGenderChange}>
                <option value="male" >Male</option>
                <option value="female">Female</option>
            </select>
        </>
    )
}

export default BasicInformation;
