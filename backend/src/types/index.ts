//represents the weight of each ticker in the etf
export interface ConstituentWeights {
    name: String;
    weight: number;
}

//represents map of specific dates prices
export interface DailyMarketData {
    date: string;
    prices: Record<string, number>;
}

//represents row data for the frontend table
export interface TableRowData {
    name: string;
    weight: number;
    latestPrice: number;
}

//represents data points for the frontend time series plot
export interface TimeSeriesDataPoint{
    date: string;
    reconstructedPrice: number;
}

//represents data needed for top5 holdings bar chart
export interface TopHoldingData{
    name: string;
    holdingSize: number;
}

//unified data object thats sent to the frontend
//all computations happen on the backend, this object gets sent to the frontend keeping it lightweight
export interface ETFAnalysisResponse{
    filename: string;
    tableData: TableRowData[];
    timeSeriesData: TimeSeriesDataPoint[];
    topHoldings: TopHoldingData[];
}