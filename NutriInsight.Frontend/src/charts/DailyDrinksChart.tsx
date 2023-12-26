import { DrinkTypes } from "../containers/Water";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { IDrinkEvent } from "../auth/firebase";
import { lightTheme } from "../App";

export interface IGraphWaterEvent {
    name: string;
    drinks: IDrinkEvent[];
}


interface IDailyDrinksChart {
    initialChartData: IGraphWaterEvent[];
    chartType: ChartType;
}

export enum ChartType {
    Last3Days = "Last3Days",
    Weekly = "Weekly",
    Monthly = "Monthly"
}

export const DailyDrinksChart = ({ initialChartData, chartType }: IDailyDrinksChart) => {

    const fillMissingDate = (data: IGraphWaterEvent[]) => {
        const dateSet = new Set(data.map(({ name }) => name));

        //@ts-ignore
        const startDate = new Date(Math.min(...Array.from(dateSet).map(date => new Date(date))));
        //@ts-ignore
        const endDate = new Date(Math.max(...Array.from(dateSet).map(date => new Date(date))));

        const result = [];

        for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            const currentDateStr = currentDate.toISOString().split('T')[0];


            const entryToUpdate = data.find((entry) => entry.name === currentDateStr);

            if (entryToUpdate) {
                // Check if the 'drinks' property is undefined
                if (entryToUpdate.drinks === undefined) {
                    entryToUpdate.drinks = [];
                }
            }

            const drinks = dateSet.has(currentDateStr)
                ? entryToUpdate
                : [];

            result.push({
                name: currentDateStr,
                //@ts-ignore
                drinks: drinks?.drinks
            });
        }

        return result;
    };

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const initialDaysData = fillMissingDate(initialChartData).map((x: any) => ({
        name: daysOfWeek[new Date(x.name).getDay()],
        water: x.drinks?.find((x: any) => x.type == DrinkTypes.Water)?.amount ?? 0 ?? 0 ?? 0,
        coffee: x.drinks?.find((x: any) => x.type == DrinkTypes.Coffee)?.amount ?? 0 ?? 0 ?? 0,
        tea: x.drinks?.find((x: any) => x.type == DrinkTypes.Tea)?.amount ?? 0 ?? 0 ?? 0,
        smoothie: x.drinks?.find((x: any) => x.type == DrinkTypes.Smoothie)?.amount ?? 0 ?? 0 ?? 0,
        milk: x.drinks?.find((x: any) => x.type == DrinkTypes.Milk)?.amount ?? 0 ?? 0 ?? 0,
        isotonic: x.drinks?.find((x: any) => x.type == DrinkTypes.Isotonic)?.amount ?? 0 ?? 0 ?? 0,
        yerbaMate: x.drinks?.find((x: any) => x.type == DrinkTypes.YerbaMate)?.amount ?? 0 ?? 0 ?? 0
    }))

    return (
        <div>
            {chartType == ChartType.Last3Days &&
                <ResponsiveContainer minWidth="520px" width='100%' aspect={4.0 / 2.5}>
                    <BarChart data={initialDaysData.slice(-3)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Legend />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="water" fill={lightTheme.turkus[100]} />
                        <Bar dataKey="coffee" fill={lightTheme.turkus[200]} />
                        <Bar dataKey="tea" fill={lightTheme.turkus[300]} />
                        <Bar dataKey="smoothie" fill={lightTheme.turkus[400]} />
                        <Bar dataKey="milk" fill={lightTheme.turkus[500]} />
                        <Bar dataKey="isotonic" fill={lightTheme.turkus[600]} />
                        <Bar dataKey="yerbaMate" fill={lightTheme.turkus[700]} />
                    </BarChart>
                </ResponsiveContainer>
            }

            {chartType == ChartType.Weekly &&
                <ResponsiveContainer minWidth="520px" width='100%' aspect={4.0 / 2.5}>
                    <BarChart data={initialDaysData.slice(-7)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Legend />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="water" fill={lightTheme.turkus[100]} />
                        <Bar dataKey="coffee" fill={lightTheme.turkus[200]} />
                        <Bar dataKey="tea" fill={lightTheme.turkus[300]} />
                        <Bar dataKey="smoothie" fill={lightTheme.turkus[400]} />
                        <Bar dataKey="milk" fill={lightTheme.turkus[500]} />
                        <Bar dataKey="isotonic" fill={lightTheme.turkus[600]} />
                        <Bar dataKey="yerbaMate" fill={lightTheme.turkus[700]} />
                    </BarChart>
                </ResponsiveContainer>
            }
            {chartType == ChartType.Monthly &&
                <ResponsiveContainer minWidth="520px" width='100%' aspect={4.0 / 2.5}>
                    <AreaChart width={620} height={320} data={initialDaysData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <Legend />
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={lightTheme.turkus[100]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={lightTheme.turkus[300]} stopOpacity={0.5} />
                            </linearGradient>
                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={lightTheme.turkus[100]} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={lightTheme.turkus[300]} stopOpacity={0.5} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="water" stroke={lightTheme.turkus[100]} fillOpacity={1} fill="url(#colorUv)" />
                        <Area type="monotone" dataKey="coffee" stroke={lightTheme.turkus[200]} fillOpacity={1} fill="url(#colorUv)" />
                        <Area type="monotone" dataKey="tea" stroke={lightTheme.turkus[300]} fillOpacity={1} fill="url(#colorUv)" />
                        <Area type="monotone" dataKey="smoothie" stroke={lightTheme.turkus[400]} fillOpacity={1} fill="url(#colorUv)" />
                        <Area type="monotone" dataKey="milk" stroke={lightTheme.turkus[500]} fillOpacity={1} fill="url(#colorUv)" />
                        <Area type="monotone" dataKey="isotonic" stroke={lightTheme.turkus[600]} fillOpacity={1} fill="url(#colorUv)" />
                        <Area type="monotone" dataKey="yerbaMate" stroke={lightTheme.turkus[700]} fillOpacity={1} fill="url(#colorUv)" />
                    </AreaChart>
                </ResponsiveContainer>
            }
        </div>
    )
}