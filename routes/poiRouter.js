import express from "express";
import {
    createPOI,
    getPOIById,
    updatePOI,
    deletePOI,
    getAllPOIs,
    getPOIsByCategory,
    getPOIsByPublisher,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getAllCategoriesController,
    getCategoryByIdController
} from "../controllers/poiController.js";

const router = express.Router();

router.post("/createPOI", createPOI);
router.get("/getPOIById/:id", getPOIById);
router.put("/updatePOI/:id", updatePOI);
router.delete("/deletePOI/:id", deletePOI);
router.post("/getAllPOIs", getAllPOIs);
router.get("/getPOIsByCategory/:category", getPOIsByCategory);
router.get("/getPOIsByPublisher/:publisherId", getPOIsByPublisher);
router.post("/createCategory", createCategoryController);
router.put("/updateCategory/:id", updateCategoryController);
router.delete("/deleteCategory/:id", deleteCategoryController);
router.get("/getAllCategories", getAllCategoriesController);
router.get("/getCategoryById/:id", getCategoryByIdController);

export default router;
