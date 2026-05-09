//represents row data in the dashboard tabel for a constituent holdings
export interface TableRowData {
    name: string;
    weight: number;
    latestPrice: number;
}

//represents calculated daily price points as a weighted sum of constituents
export interface TimeSeriesDataPoint{
    date: string;
    reconstructedPrice: number;
}

//represents data needed for top5 holdings bar chart
export interface TopHoldingData{
    name: string;
    holdingSize: number;
}

//unified data object thats received from the backend
//all computations happen on the backend, this object gets sent to the frontend keeping it lightweight
export interface ETFAnalysisResponse{
    filename: string;
    tableData: TableRowData[];
    timeSeriesData: TimeSeriesDataPoint[];
    topHoldings: TopHoldingData[];
}