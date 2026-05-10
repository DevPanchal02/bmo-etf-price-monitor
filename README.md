# BMO ETF Price Monitor
A full-stack application for reconstructing ETF prices and visualizing portfolio holdings for the BMO Data Cognition Team.

## How to Run

You will need two terminal windows to run the frontend and backend concurrently. Make sure you have Node.js installed.

**1. Start the Backend:**
```bash
cd backend
npm install
npm run dev
```
*Note: The backend runs on `http://localhost:3001`. Wait a second for it to log "Cached X days of market data" before using the app.*

**2. Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`. Open this in your browser.*

---

## Tech Stack & Design Choices

The prompt mentioned BMO primarily uses Python on the backend. However, I built this using **React + Node.js (Express) + TypeScript**. 

I chose this stack simply because it's what I am most comfortable with. I know I can build reliably and deliver a polished product. 

---

## Assumptions Made

To keep the scope focused given the limited requirements, I made the following assumptions:

1. **Static Weights:** As stated in the prompt, I assumed constituent weights do not drift over time. The historical backtest applies the exact uploaded weight to every single historical day.
2. **Chronological Sorting of Data:** I assumed `prices.csv` is strictly sorted chronologically (oldest dates at the top, newest at the bottom). My logic for pulling the "latest price" simply grabs the final row of the cached dataset.
3. **Memory Limits are Not a Concern:** Holding a few megabytes of CSV data in memory is perfectly fine for this challenge. If this were a real production app with gigabytes of historical tick data, I wouldn't do this. I'd use a proper database.
4. **Missing Constituents = $0:** If a user uploads an ETF containing a ticker that does not exist in `prices.csv` or has missing data for a specific day, I assume the price is `$0` rather than failing the entire calculation. 
5. **Clean Target Weights:** I assumed the uploaded CSVs might be dirty. I added defensive parsing logic to throw errors and reject the file if it encounters `NaN`.

---

## Bonus Features

While fulfilling the core requirements, I added a few extra quality-of-life features:
* **KPI Bar:** Added a top bar that automatically calculates the ETF's net price change and percentage return over the available period.
* **Keyboard Navigation:** You can use the `Left` and `Right` arrow keys to quickly toggle between multiple uploaded ETFs without having to click the tabs. 
* **Multi-Upload:** You can drag and drop multiple ETF `.csv` files at once. The backend will sequentially process them and load them all into the frontend's state.