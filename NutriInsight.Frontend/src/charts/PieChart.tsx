import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from "recharts";
import { lightTheme } from "../App";

interface IPieChartWater {
    data: any;
}

export const PieChartWater = ({ data }: IPieChartWater) => {

    return (
        // <ResponsiveContainer minWidth="380px" width='100%' aspect={4.0 / 3.0}>
        <PieChart width={280} height={100}>
            <Legend
                height={36}
                iconType="circle"
                layout="vertical"
                verticalAlign="middle"
                iconSize={10}
            />
            <Pie
                data={data}
                cx={30}
                cy={50}
                innerRadius={15}
                outerRadius={20}
                fill={lightTheme.turkus[100]}
                paddingAngle={0}
                dataKey="value"
            >
            </Pie>
        </PieChart>
        // </ResponsiveContainer>
    );
}
