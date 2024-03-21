import express from "express";
import {
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getCategoryController
} from "../controllers/categoryController.js"; 
const router = express.Router();

router.post("/crateCategory", createCategoryController);
router.put("/updateCategory", updateCategoryController);
router.delete("/deleteCategory/:id", deleteCategoryController);
router.get("/getCategory", getCategoryController);

export default router;