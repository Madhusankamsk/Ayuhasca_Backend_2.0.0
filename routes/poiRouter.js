import express from "express";
import {
    createPOI,
    getPOIs,
    getPoiTiles,
    getEachPoi,
    deletePoi,
    searchPois,
} from "../controllers/poiController.js";

const router = express.Router();

router.post("/add", createPOI);
router.post("/get/:id", getPOIs);
router.post("/gettiles/:id", getPoiTiles)
router.post("/getdata", getEachPoi);
router.delete("/delete/:id", deletePoi); //router.delete("/deletePOI/:id", deletePOI);
router.get("/search/:id", searchPois)






// router.put("/updatePOI/:id", updatePOI);
// router.delete("/deletePOI/:id", deletePOI);
// router.post("/getAllPOIs", getAllPOIs);
// router.get("/getPOIsByCategory/:category", getPOIsByCategory);
// router.get("/getPOIsByPublisher/:publisherId", getPOIsByPublisher);

// router.post("/createCategory", createCategoryController);
// router.put("/updateCategory/:id", updateCategoryController);
// router.delete("/deleteCategory/:id", deleteCategoryController);
// router.get("/getAllCategories", getAllCategoriesController);
// router.get("/getCategoryById/:id", getCategoryByIdController);

export default router;
