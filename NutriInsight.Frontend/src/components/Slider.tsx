import { Dispatch, SetStateAction, useState } from "react";


interface ISlider {
    step: number;
    value: number;
    setValue: any;
    max: number;
    min: number;
}

const Slider = ({ step, value, setValue, min, max }: ISlider) => {



    const [minValue, setMinValue] = useState(value);
    const [maxValue] = useState(max);

    const handleMinChange = (event: any) => {
        event.preventDefault();
        const value = parseFloat(event.target.value);
        // the new min value is the value from the event.
        // it should not exceed the current max value!
        const newMinVal = Math.min(value, maxValue - step);
        setValue(newMinVal);
        setMinValue(newMinVal);
    };


    return (
        <div>
            <input
                type="range"
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={handleMinChange}
            />
        </div>
    );
};

export default Slider;