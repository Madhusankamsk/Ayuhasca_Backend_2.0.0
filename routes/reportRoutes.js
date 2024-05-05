import express from "express";
import {
    createReportController,
    deleteReportController,
    getReportByIdController
} from "../controllers/reportController.js"; 
const router = express.Router();

router.post("/createReport", createReportController);
router.delete("/deleteReport/:id", deleteReportController);
router.get("/getReportById/:id", getReportByIdController);

export default router;