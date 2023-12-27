import { AnalysisSummary, analyzeDrinksData } from "../../src/utils";
import { IGraphWaterEvent } from "./DailyDrinksChart";

interface IAnalysisDailyGraph {
    initialChartData: IGraphWaterEvent[];
}

const AnalysisDailyGraph = ({ initialChartData }: IAnalysisDailyGraph) => {

    const analysisSummary: AnalysisSummary = analyzeDrinksData(initialChartData);

    return (
        <div>
            <p>Total amount: {analysisSummary.overallSummary.totalAmount}</p>
            <p>Most consumed type: {analysisSummary.overallSummary.mostConsumedType}</p>
            <p>Most consumed amount: {analysisSummary.overallSummary.mostConsumedAmount}</p>
            <p>Least consumed type: {analysisSummary.overallSummary.leastConsumedType}</p>
            <p>Least consumed amount: {analysisSummary.overallSummary.leastConsumedAmount}</p>
            <p>Average consumption: {analysisSummary.overallSummary.averageConsumption}</p>
        </div>
    )
}

export default AnalysisDailyGraph;