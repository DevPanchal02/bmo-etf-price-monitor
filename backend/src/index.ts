import express from "express";
import cors from "cors";
import { MarketDataService } from "./services/marketData.service.js";
import etfRoutes from "./routes/etf.routes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors())
app.use(express.json())


//readiness flag
let isReady = false


//Health check to ensure service is reachable
app.get('/api/health', (_req, res) => {
    if (isReady) {
        res.json({ status: 'ok', message: 'ETF API is running and data is loaded' })
    }
    else {
        res.status(503).json({ status: 'starting', message: 'Loading market data...' })
    }
})

//primary logic route
app.use("/api/etf", etfRoutes)

//start server to load price data into memory, opening the port only after data is loaded.
//This prevents an error where a user attempts to upload a file before the reference prices have been loaded.
async function startServer() {
    try {
        await MarketDataService.initializeData();
        isReady = true

        app.listen(PORT, () => {
            console.log(`ETF Price Monitor Backend is ready on PORT: ${PORT}`)
        })
    }
    catch (error) {
        console.error("failed to start server", error)
        process.exit(1)
    }
}

startServer()