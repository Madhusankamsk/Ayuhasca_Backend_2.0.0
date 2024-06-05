import express from "express";
import {
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getCategoryController,
    getCategoryNameByIdController,
    createMultipleCategoriesController
} from "../controllers/categoryController.js"; 
const router = express.Router();

router.post("/createCategory", createCategoryController);
router.put("/updateCategory", updateCategoryController);
router.delete("/deleteCategory/:id", deleteCategoryController);
router.get("/getCategory", getCategoryController);
router.get("/getCategoryNameById/:id", getCategoryNameByIdController);
router.post("/createMultipleCategories", createMultipleCategoriesController);

export default router;