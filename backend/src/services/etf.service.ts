import { MarketDataService } from "./marketData.service.js";
import { ETFAnalysisResponse, TableRowData, TimeSeriesDataPoint, TopHoldingData } from "../types/index.js";

// Responsible for applying portfolio weights against market data to generate analytics
export class ETFService {

    static generateETFAnalysis(filename: string, weights: Record<string, number>): ETFAnalysisResponse {
        const latestPrices = MarketDataService.getLatestPrices();
        const historicalPrices = MarketDataService.getHistoricalPrices()

        const tableData: TableRowData[] = []
        const allHoldings: TopHoldingData[] = [];

        //Generates table data and calculates holdings
        for (const [ticker, weight] of Object.entries(weights)){
            const latestPrice = latestPrices[ticker] ?? 0
            const holdingSize = weight * latestPrice

            tableData.push({
                name:ticker,
                weight: weight,
                latestPrice: latestPrice
            })

            allHoldings.push({
                name: ticker,
                holdingSize: holdingSize
            })
        }

        //extracts top 5 holdings, by sorting desc and slicing top5
        const topHoldings = allHoldings.sort((a,b) => b.holdingSize - a.holdingSize).slice(0, 5)

        //Contructs time series price
        //etf price =  sum of (cosntituent weight * constituent price)
        const timeSeriesData: TimeSeriesDataPoint[] = historicalPrices.map((dailyData) => {
            let dailyEtfPrice = 0

            for (const[ticker, weight] of Object.entries(weights)){
                const dayPrice = dailyData.prices[ticker] ?? 0
                dailyEtfPrice += weight * dayPrice
            }
            return {
                date: dailyData.date,
                reconstructedPrice: Number(dailyEtfPrice.toFixed(4))
            }
        })
        return {
            filename,
            tableData,
            timeSeriesData,
            topHoldings
        }

    }
}