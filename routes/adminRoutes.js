import express from "express";
import {
    getReportController,
    getEventReportController,
    blockEventController,
    blockEventAddEvent
} from "../controllers/adminController.js"; 
const router = express.Router();

router.get("/getReport", getReportController);
router.get("/getEventReport", getEventReportController);
router.put("/toggleEvent", blockEventController);
router.put("/togleAddEvent", blockEventAddEvent);

export default router;