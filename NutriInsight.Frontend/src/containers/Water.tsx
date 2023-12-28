import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { IDailyDrinks, auth, readFirebaseUserData } from "../auth/firebase";
import styled from 'styled-components';
import { DocumentData } from "firebase/firestore";
import { ChartType, DailyDrinksChart, IGraphWaterEvent } from "../charts/DailyDrinksChart";
import { PieChartWater } from "../charts/PieChart";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Tooltip } from "react-tooltip";
import Menu from "../components/Menu";
import { lightTheme } from "../App";

const primaryColor = '#243DD7';
export const googleCalendarId = "piotrzak77@gmail.com"

export const Tabs = styled.div`
  display: flex;
  margin-top: 40px;
`;

export const Tab = styled.div`
  font-size: 24px;
  margin-right: 20px;

  &:hover {
    cursor: pointer;
  }
`;

export const CurrentWaterStreak = styled.div`
  display: flex;
`;

export const WaterEvents = styled.div`
  display: flex;
`;

export const WaterGlass = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #36D1DC; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #4B73E9, #6092F3); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #4B73E9, #6092F3); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    margin-right: 20px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        cursor: pointer;
    }
`;

export const WaterGlassEmpty = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
  background: #fff;
  border: 1px solid ${primaryColor};
  color: #4B73E9;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`;

export const ProgressBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;    
    margin: 0 80px;
    width: calc(100% - 160px);

    @media (max-width: 768px) {
        margin: 0 10px;
        width: calc(100% - 20px)
    }

    h4 {
        margin: 10px 0;
    }
    > p {
        margin: 0;
    }
`

// 21.09 - after production needs to delete icons - currently archived data saved those in firebase,
export enum DrinkTypes {
    Water = "Water 💦",
    Tea = "Tea 🍵",
    Smoothie = "Smoothie 🧋",
    Milk = "Milk 🥛",
    Coffee = "Coffee ☕️",
    YerbaMate = "Yerba Mate 🧉",
    Isotonic = "Isotonic  🥤"
}

const Dashboard = styled.div`
    display: flex;
    flex-wrap: wrap;
    `

const Widget = styled.div`
    margin: 10px 10px;
    width: calc(25% - 60px);
    height: 100px;
    background-color: ${({ theme }) => theme.basic[100]};
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: 768px) {
        width: 100%;
        height:100%;
    `

const MediumWidget = styled.div`
    background: transparent;
    margin: 10px 10px;
    width: calc(50% - 60px);
    background-color: ${({ theme }) => theme.basic[100]};
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 768px) {
        width: 100%;
        height:100%;
    }
`


const TodayWaterTooltip = "explanation"
const DrinksTodayTooltip = "explanation"
const OverallSummaryTooltip = "explanation"
const MonthlyDrinksTooltip = "explanation"
const WeeklyDrinksTooltip = "explanation"

const Water = () => {

    const location = useLocation();

    const [chartData, setChartData] = useState<IGraphWaterEvent[]>([])
    const [drinksStats, setDrinksStats] = useState<IDailyDrinks[]>([])

    const today = new Date().toISOString().split('T')[0];

    const readDrinksStats = async () => {
        const waterStats = await readFirebaseUserData(auth?.currentUser?.uid ?? "", "drinkstats")

        if (!waterStats) {
            return null
        }

        const stats = waterStats[0].dates.map((x: DocumentData) => ({
            name: x.date,
            drinks: x.drinks
        }))

        setDrinksStats(waterStats[0].dates.map((x: DocumentData) => ({
            name: x.date,
            date: x.date,
            drinks: x.drinks
        })))
        setChartData(stats.sort((a: IGraphWaterEvent, b: IGraphWaterEvent) => new Date(a.name).getTime() - new Date(b.name).getTime()))
    }

    useEffect(() => {
        readDrinksStats()
    }, [])

    const overallWaterAmount = chartData.reduce((sum, drink) => sum + (drink.drinks?.find(x => x.type === DrinkTypes.Water)?.amount || 0), 0);
    const todayWater = chartData.find(x => x.name == today)?.drinks.find(x => x.type == DrinkTypes.Water)?.amount ?? 0;
    const waterMinimumDaily = 2000;


    const waterFulfillmentData = [{
        name: "Today",
        value: todayWater,
        fill: lightTheme.turkus[100]
    },
    {
        name: "Remaining",
        value: waterMinimumDaily - todayWater,
        fill: lightTheme.turkus[300]
    }
    ]

    const drinksData = [
        { name: DrinkTypes.Water, fill: lightTheme.turkus[100] },
        { name: DrinkTypes.Tea, fill: lightTheme.turkus[200] },
        { name: DrinkTypes.Coffee, fill: lightTheme.turkus[300] },
        { name: DrinkTypes.Milk, fill: lightTheme.turkus[400] },
        { name: DrinkTypes.Smoothie, fill: lightTheme.turkus[500] },
        { name: DrinkTypes.YerbaMate, fill: lightTheme.turkus[600] },
        { name: DrinkTypes.Isotonic, fill: lightTheme.turkus[700] }
    ];

    const dailyDrinksData = drinksData.map(drink => ({
        ...drink,
        value: drinksStats.find(x => x.date == today)?.drinks.find(x => x.type == drink.name)?.amount ?? 0,
    }))


    const totalDrinksAmount = drinksData.map(drink => ({
        ...drink,
        value: drinksStats.reduce((sum, stats) => sum + (stats.drinks?.find(x => x.type === drink.name)?.amount || 0), 0)
    }));

    return (
        <Container>
            <Menu />
            <Dashboard>
                <Widget>
                    <h4>Today Water: <AiOutlineInfoCircle data-tooltip-id="tooltip-one" /></h4>
                    <Tooltip id="tooltip-one"
                        place="right"
                        content={TodayWaterTooltip}
                    />
                    <PieChartWater data={waterFulfillmentData} />
                </Widget>
                <Widget>
                    <h4>Drinks today: <AiOutlineInfoCircle data-tooltip-id="tooltip-two" /></h4>
                    <Tooltip id="tooltip-two"
                        place="right"
                        content={DrinksTodayTooltip}
                    />
                    <PieChartWater data={dailyDrinksData} />
                </Widget>
                <Widget>
                    <h4>Water overall <AiOutlineInfoCircle data-tooltip-id="tooltip-three" /></h4>
                    <Tooltip id="tooltip-three"
                        place="right"
                        content={DrinksTodayTooltip}
                    />
                    <h2>{overallWaterAmount} ml</h2>
                </Widget>
                <Widget>
                    <h4>Drinks overall <AiOutlineInfoCircle data-tooltip-id="tooltip-drinks-overall" /></h4>
                    <Tooltip id="tooltip-drinks-overall"
                        place="right"
                        content={DrinksTodayTooltip}
                    />
                    <PieChartWater data={totalDrinksAmount} />
                </Widget>
                <MediumWidget>
                    <h4>Last 3 days: <AiOutlineInfoCircle data-tooltip-id="tooltip-four" /></h4>
                    <Tooltip id="tooltip-four"
                        place="right"
                        content={MonthlyDrinksTooltip}
                    />
                    <DailyDrinksChart initialChartData={chartData} chartType={ChartType.Last3Days} /></MediumWidget>
                <MediumWidget>
                    <h4>Weekly drinks: <AiOutlineInfoCircle data-tooltip-id="tooltip-fifth" /></h4>
                    <Tooltip id="tooltip-fifth"
                        place="right"
                        content={WeeklyDrinksTooltip}
                    />
                    <DailyDrinksChart initialChartData={chartData} chartType={ChartType.Weekly} /></MediumWidget>
            </Dashboard>
        </Container>
    )
}

export default Water;
