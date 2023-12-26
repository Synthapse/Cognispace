import { useState } from "react";


interface IRangeSlider {
    step: number;
    min: number;
    max: number;
}

const RangeSlider = ({ step, min, max } : IRangeSlider) => {
    const [minValue, setMinValue] = useState(min);
    const [maxValue, setMaxValue] = useState(max);
    const handleMinChange = (event: any) => {
        event.preventDefault();
        const value = parseFloat(event.target.value);
        // the new min value is the value from the event.
        // it should not exceed the current max value!
        const newMinVal = Math.min(value, maxValue - step);
        setMinValue(newMinVal);
    };
    const handleMaxChange = (event: any) => {
        event.preventDefault();
        const value = parseFloat(event.target.value);
        // the new max value is the value from the event.
        // it must not be less than the current min value!
        const newMaxVal = Math.max(value, minValue + step);
        setMaxValue(newMaxVal);
    };
    return (
        <div>
            <input
                type="range"
                value={minValue}
                min={min}
                max={max}
                step={step}
                onChange={handleMinChange}
            />
            <input
                type="range"
                value={maxValue}
                min={min}
                max={max}
                step={step}
                onChange={handleMaxChange}
            />
        </div>
    );
};

export default RangeSlider;