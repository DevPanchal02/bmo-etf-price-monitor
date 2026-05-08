import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors())
app.use(express.json()

)

//check to ensure service is reachable
app.get('/api/health', (_req, res) => {
    res.json({status: 'ok', message: 'ETF API is running'})
})


app.listen(PORT, () => {
    console.log(`ETF Price Monitor Backend running on PORT: ${PORT}`)
})