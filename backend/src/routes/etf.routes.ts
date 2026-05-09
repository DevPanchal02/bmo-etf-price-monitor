import { Router } from "express";
import { ETFController, upload } from "../controllers/etf.controller.js";

const router = Router();

// bind transport layer to the controller, accepting up to 10 files
router.post(
    "/upload", 
    upload.array("file", 10), 
    ETFController.analyzeETFs
);

export default router;