import { ProgressBar } from "../charts/ProgressBar";
import { LuGlassWater } from "react-icons/lu";
import { addEvent, addMinutesToDate, findNearestFutureEvents, findPositionsInFirstArray, getSpecificHourDate } from "../utils";
import { IDailyDrinks, IDrinkEvent, auth, readFirebaseUserData, writeWaterStatsData } from "../auth/firebase";
import { useEffect, useState } from "react";
import { Container, CurrentWaterStreak, DrinkTypes, ProgressBarContainer, WaterGlass, WaterGlassEmpty, googleCalendarId } from "./Water";
import { DocumentData } from "firebase/firestore";
import styled from "styled-components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Tooltip } from "react-tooltip";
import { IGraphWaterEvent } from "../charts/DailyDrinksChart";
import Menu from "../components/Menu";

export const drinks = [DrinkTypes.Water, DrinkTypes.Tea, DrinkTypes.Smoothie, DrinkTypes.Milk, DrinkTypes.Coffee, DrinkTypes.YerbaMate, DrinkTypes.Isotonic]
const primaryColor = '#243DD7';
const borderColor = "#9F9F9F"

interface DailyDrinks {
    date: string;
    drinks: IDrinkEvent[];
}

interface IDrinksDates {
    userId: string,
    dates: DailyDrinks[]
}

const Drinks = styled.div`
    display: flex;
    margin-top: 20px;
    align-items: center;
`
const WaterStreaks = styled.div`
    display: flex;
    padding: 20px 0;

    align-items: center;
    border-bottom: 1px ${borderColor} solid;
    justify-content: space-between;

    > h2, h1 {
        margin-right: 60px;
    }
`
const sharedBadgeStyles = `
    border: 1px ${primaryColor} solid;
    height: 32px;
    border-radius: 16px;
    font-size: 14px;
    padding: 0 12px;
    margin: 0 8px;
    display: flex;
    align-items: center;

    &:hover {
        cursor:pointer;
    }
`;

const ActiveBadge = styled.div`
    background: ${primaryColor};
    color: white;
    ${sharedBadgeStyles}
`;

const Badge = styled.div`
    color: ${primaryColor};
    ${sharedBadgeStyles}
`;

const drinkTypes = [
    { title: 'Tea', type: DrinkTypes.Tea },
    { title: 'Smoothie', type: DrinkTypes.Smoothie },
    { title: 'Milk', type: DrinkTypes.Milk },
    { title: 'Coffee', type: DrinkTypes.Coffee },
    { title: 'Yerba Mate', type: DrinkTypes.YerbaMate },
    { title: 'Isotonic', type: DrinkTypes.Isotonic },
];

const DrinksContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap
`


export const Hydration = () => {

    const today = new Date().toISOString().split('T')[0];
    const [chartData, setChartData] = useState<IGraphWaterEvent[]>([])
    const todayWater = chartData.find(x => x.name == today)?.drinks.find(x => x.type == DrinkTypes.Water)?.amount ?? 0;
    const todayTea = chartData.find(x => x.name == today)?.drinks.find(x => x.type == DrinkTypes.Tea)?.amount ?? 0;


    const waterMinimumDaily = 2000;
    const [drinksStats, setDrinksStats] = useState<any>([])

    const breakfastTime = getSpecificHourDate(8, 0);

    const uploadTypeAmount = (drinkType: string, amount: number) => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const date = new Date().toISOString().split('T')[0];


            const drinks: IDrinkEvent[] = drinksStats.dates.find((x: { date: string; }) => x.date === today)?.drinks ?? [];
            const existingDrinkEvent = drinks.find(x => x.type === drinkType);

            if (existingDrinkEvent) {
                existingDrinkEvent.amount += amount;
            } else {
                const drinkEvent: IDrinkEvent = {
                    type: drinkType,
                    amount: amount,
                };
                drinks.push(drinkEvent);
            }

            const drinksDates: IDrinksDates = {
                userId: userId,
                dates:
                    (drinksStats.dates.some((entry: { date: string; }) => entry.date === date)
                        ? drinksStats.dates.map((entry: { date: string; }) => (entry.date === date ? { date, drinks } : entry))
                        : [...drinksStats.dates, { date, drinks }]
                    ),
            };

            // rethink about make this object more complex - and not holding water stats per day - but days are another array in this object.
            writeWaterStatsData(drinksDates).then(() => {
                readDrinksStats();
            });
        }
    };

    const generateWaterEvents = () => {
        return Array.from({ length: 10 }, (_, i) => ({
            summary: "Drinks Water",
            location: "",
            start: {
                dateTime: addMinutesToDate(breakfastTime, i * 60 + 55),
                timeZone: "Europe/Bucharest"
            },
            end: {
                dateTime: addMinutesToDate(breakfastTime, i * 60 + 60),
                timeZone: "Europe/Bucharest"
            },
            recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
            attendees: [],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: "email", minutes: 24 * 60 },
                    { method: "popup", minutes: 10 }
                ]
            }
        }));
    };

    const waterEvents = generateWaterEvents();
    const currentWaterEvents = findNearestFutureEvents(waterEvents);

    const fulfillmentStatus = currentWaterEvents.map((event: any, index: number) => {
        // Retrieve the position for the current event
        const positions = findPositionsInFirstArray(waterEvents, currentWaterEvents);
        const position = positions[index];

        // Calculate the accumulated amount up to this event
        if (!position) {
            return false;
        }
        const accumulatedAmount = position * 250;

        // Check if the event is fulfilled
        return accumulatedAmount <= todayWater;
    });

    const readDrinksStats = async () => {
        const waterStats = await readFirebaseUserData(auth?.currentUser?.uid ?? "", "drinkstats")

        const stats = waterStats[0].dates.map((x: DocumentData) => ({
            name: x.date,
            drinks: x.drinks
        }))

        setDrinksStats(waterStats[0])
        setChartData(stats.sort((a: IGraphWaterEvent, b: IGraphWaterEvent) => new Date(a.name).getTime() - new Date(b.name).getTime()))
    }

    useEffect(() => {
        readDrinksStats()
    }, [])


    const waterDailyTotalIntake = chartData.find(x => x.name == new Date().toISOString().split('T')[0])?.drinks.find(x => x.type == DrinkTypes.Water)?.amount ?? 0;
    const dailyIntake = 2500;

    return (
        <Container>
            <Menu />
            <Tooltip id="tooltip-one"
                place="right"
                content="Easily log your water consumption and track your progress toward staying adequately hydrated."
            />


            <WaterStreaks>
                <h1> Water:</h1>
                <h2>{waterDailyTotalIntake} / {dailyIntake} ml</h2>
                <CurrentWaterStreak>
                    {currentWaterEvents.map((event: any, index: number) => {
                        const hours = event?.start.dateTime.getHours();
                        const minutes = event?.start.dateTime.getMinutes();
                        const className = fulfillmentStatus[index] ? "water-glass circle center" : "water-glass-empty circle center";

                        return (
                            <div>
                                {className.includes('water-glass-empty') ? (
                                    <WaterGlassEmpty>
                                        <LuGlassWater size={14} />
                                    </WaterGlassEmpty>
                                ) : (
                                    <WaterGlass>
                                        <LuGlassWater size={14} />
                                    </WaterGlass>
                                )}
                                <p>{hours}:{minutes}</p>
                            </div>
                        )

                    })}
                </CurrentWaterStreak>
                <ProgressBarContainer>
                    <ProgressBar key={"1"} bgcolor={"#6a1b9a"} completed={todayWater * 100 / waterMinimumDaily} />
                    <WaterGlass onClick={() => uploadTypeAmount(DrinkTypes.Water, 250)}>
                        <div>
                            +
                        </div>
                    </WaterGlass>
                </ProgressBarContainer>
            </WaterStreaks>

            <DrinksContainer>
                {drinkTypes.map((drinkType, index) => (
                    <DrinkType
                        key={index}
                        title={drinkType.title}
                        type={drinkType.type}
                        chartData={chartData}
                        uploadTypeAmount={uploadTypeAmount}
                    />
                ))}
            </DrinksContainer>


            {/* Water alerts:
            <AiOutlineInfoCircle data-tooltip-id="tooltip-one" />
            <button onClick={() => addWaterEvents()} className="primary-button">Add reminders to callendar</button> */}
        </Container>
    )
}

interface IDrinkType {
    title: string;
    type: string;
    chartData: IGraphWaterEvent[];
    uploadTypeAmount: (drinkType: string, amount: number) => void;
}

const DrinksStreaks = styled.div`
    display: flex;
    padding: 20px 0;
    width: 30%;
    align-items: center;
    border-bottom: 1px ${borderColor} solid;
    justify-content: space-between;

    > h2, h1 {
        margin-right: 60px;
        font-size:18px;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`

const DrinkType = ({ title, type, chartData, uploadTypeAmount }: IDrinkType) => {
    const dailyTotalAmount = chartData.find(x => x.name == new Date().toISOString().split('T')[0])?.drinks.find(x => x.type == type)?.amount ?? 0;

    return (
        <DrinksStreaks>
            <h1>{title}:</h1>
            <h2>{dailyTotalAmount} ml</h2>
            <ProgressBarContainer>
                <WaterGlass onClick={() => uploadTypeAmount(type, 250)}>
                    <div>+</div>
                </WaterGlass>
            </ProgressBarContainer>
        </DrinksStreaks>
    );
};

const SelectDrink = () => {

    const [activeDrinkType, setActiveDrinkType] = useState<DrinkTypes>(DrinkTypes.Water)

    return (
        <Drinks>
            Select a drink:
            {drinks.map((drink) => (
                <div onClick={() => setActiveDrinkType(drink)} key={drink}>
                    {activeDrinkType.toString().includes(drink) ? (
                        <ActiveBadge>{drink}</ActiveBadge>
                    ) : (
                        <Badge>{drink}</Badge>
                    )}
                </div>
            ))}
        </Drinks>
    )
}