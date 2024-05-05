import express from "express";
import {
    createReportController,
    updateReportController,
    deleteReportController,
    getReportByIdController
} from "../controllers/reportController.js"; 
const router = express.Router();

router.post("/createReport", createReportController);
router.put("/updateReport", updateReportController);
router.delete("/deleteReport/:id", deleteReportController);
router.get("/getReportById/:id", getReportByIdController);

export default router;