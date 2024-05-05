import express from "express";
import {
    getReportController,
    getEventReportController
} from "../controllers/adminController.js"; 
const router = express.Router();

router.get("/getReport", getReportController);
router.get("/getEventReport", getEventReportController);

export default router;