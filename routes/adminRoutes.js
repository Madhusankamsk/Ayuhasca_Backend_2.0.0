import express from "express";
import {
    getReportController,
    getEventReportController,
    blockEventController,
    blockEventAddEvent,
    whereIsUsers
} from "../controllers/adminController.js"; 
const router = express.Router();

router.get("/getReport", getReportController);
router.get("/getEventReport", getEventReportController);
router.put("/toggleEvent", blockEventController);
router.put("/togleAddEvent", blockEventAddEvent);
router.get("/whereistheuser", whereIsUsers);

export default router;