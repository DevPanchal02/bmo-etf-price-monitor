import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync"
import { RawPriceRow } from '../types/index.js';

//hardcoded paths for the provided data files
const DATA_DIR = path.resolve(process.cwd(), 'src/data');
const PRICES_FILE = path.join(DATA_DIR, 'bankofmontreal-e134q-1arsjzss-prices.csv')

//local type for historical price cache
export interface ProcessedDailyPrice {
    date: string;
    prices: Record<string, number>
}

// data access layer, responsible for caching historical prices and reading etf weight from raw csv files.
export class MarketDataService {

    private static cachedPrices: ProcessedDailyPrice[] | null = null
    private static latestPrices: Record<string, number> = {}

    //initializes prices.csv data into local cache that persists till server restart
    // raw csv data as {"date":string, "a, b, c": string} -> Convert non date values to int storing as prices object {"date": string, "prices": {a, b, c}: int}
    static async initializeData(): Promise<void> {
        try{
            const pricesRaw = await fs.readFile(PRICES_FILE, "utf-8");
            const records = parse(pricesRaw, {columns: true, skip_empty_lines: true}) as RawPriceRow[];

            this.cachedPrices = records.map((row) => {
                const date = row.DATE;
                const prices: Record<string, number> = {};

                for (const [key, value] of Object.entries(row)) {
                    if (key !== "DATE"){
                        prices[key] = parseFloat(value)
                    }
                }
                return {date, prices}
            } );
            if (this.cachedPrices.length > 0){
                const lastRecord = this.cachedPrices[this.cachedPrices.length - 1];
                if (lastRecord){
                    this.latestPrices = lastRecord.prices;
                }
            }
            console.log(`Cached ${this.cachedPrices.length} days of market data`);
        }
        catch (error){
            console.error("failed to cache market data ",error)
            process.exit(1)
        }
    }

    //returns cached time series data
    static getHistoricalPrices(): ProcessedDailyPrice[]{
        if (!this.cachedPrices){
            throw new Error("cached price data not initialized")
        }
        else{
            return this.cachedPrices
        }
    }

    //returns cached latest market close price for all available constituents
    static getLatestPrices(): Record<string, number>{
        if (Object.keys(this.latestPrices).length === 0){
            throw new Error('latest price data not initialized')
        }
        else{
            return this.latestPrices
        }
    }

    //Parses weights directly from uploaded csv data
    static parseUploadedEtfWeights(uploadedCsvBuffer: Buffer): Record<string, number>{
        const rawData = uploadedCsvBuffer.toString('utf-8');
        const records = parse(rawData, {columns: true, skip_empty_lines: true}) as {name: string; weight:string}[]

        const weights: Record<string, number> = {}
        for (const record of records){
            weights[record.name] = parseFloat(record.weight)
        }
        return weights
    }

}