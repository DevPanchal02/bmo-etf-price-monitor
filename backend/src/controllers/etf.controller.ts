import { Request, Response } from "express";
import { MarketDataService } from "../services/marketData.service.js";
import { ETFService } from "../services/etf.service.js";
import multer from "multer";

//keeps uploads in the ram ensuring app is stateless preventing disk writes
const storage = multer.memoryStorage();

//restricts uploads to 50mb to prevent memory fill up
export const upload = multer ({
    storage,
    limits: {fileSize: 50 * 1024 * 1024}
})

//controller for ETF upload and analysis
//Handles HTTP transport, validation, and service orchestration
export class ETFController {

    static async analyzeETFs (req: Request, res: Response): Promise<void> {
    try{
        const files = req.files as Express.Multer.File[]


        //rejects empty files immediately 
        if (!files || files.length === 0) {
            res.status(400).json({error: "No files uploaded!"})
            return
        }

        const analysisResults = []

        //we process each file sequentially since multifile upload is allowed
        for (const file of files){
            //Validates received file is CSV, preventing crashes.
            if (file.mimetype !== "text/csv" && !file.originalname.endsWith(".csv")) {
                res.status(400).json({error: `${file.originalname} is not a valid CSV!`})
                return
            }
            const weights = MarketDataService.parseUploadedEtfWeights(file.buffer)
            const analysis = ETFService.generateETFAnalysis(file.originalname, weights)

            analysisResults.push(analysis)
        }
        res.status(200).json(analysisResults)
    }
    catch (error){
        console.error("[ETFController] failed to process uploaded etf : ", error)
        res.status(500).json({error: "server error during etf processing"})
        }
    }
}