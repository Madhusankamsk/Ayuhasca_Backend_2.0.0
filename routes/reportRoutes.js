import express from "express";
import {
    createReportController,
    updateReportController,
    deleteReportController,
    getReportController,
    getReportByIdController
} from "../controllers/reportController.js"; 
const router = express.Router();

router.post("/crateReport", createReportController);
router.put("/updateReport", updateReportController);
router.delete("/deleteReport/:id", deleteReportController);
router.get("/getReport", getReportController);
router.get("/getReportById/:id", getReportByIdController);

export default router;