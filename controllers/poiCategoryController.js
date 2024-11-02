import PointCatecories from "../models/poiCategories.js";

// create category controller
const createCategoryController = async (req, res) => {
    try {
        const { name, id, marker_image } = req.body;

        const newCategory = new PointCatecories({
            name,
            id,
            marker_image,
        });

        const savedCategory = await newCategory.save();

        res.status(201).json({
            success: true,
            message: 'Poi Category created successfully',
            data: savedCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Poi Category creation failed',
            error: error.message,
        });
    }
};

const updateCategoryController = async (req, res) => {
    try {
        const { _id } = req.body;
        const { name, id , marker_image } = req.body;

        const updatedCategory = await PointCatecories.findByIdAndUpdate(
            _id,
            { name, id , marker_image},
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Poi Category updated successfully',
            data: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Poi Category update failed',
            error: error.message,
        });
    }
};

const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        await PointCatecories.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Poi Category deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Poi Category deletion failed',
            error: error.message,
        });
    }
}

const getCategoryController = async (req, res) => {
    try {
        const categories = await PointCatecories.find();

        res.status(200).json({
            success: true,
            message: 'Poi Categories fetched successfully',
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Poi Categories fetching failed',
            error: error.message,
        });
    }
};

const getCategoryNameByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryId = parseInt(id, 10);
        const category = await PointCatecories.findOne({ id });
        const categoryName = category.name
        console.log("category id: " + categoryId);
        console.log("category: " + category);
        console.log("category name: " + categoryName);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Poi Category not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Poi Categories Name fetched successfully',
            data: categoryName,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Poi Categories Name fetching failed',
            error: error.message,
        });
    }
};

const createMultipleCategoriesController = async (req, res) => {
    try {
        const categoriesList = req.body.categoriesList;

        const savedCategories = [];
        for (const category of categoriesList) {
            const { name, id, marker_image } = category;

            const newCategory = new PointCatecories({
                name,
                id,
                marker_image,
            });

            const savedCategory = await newCategory.save();
            savedCategories.push(savedCategory);
        }

        res.status(201).json({
            success: true,
            message: 'Poi Categories created successfully',
            data: savedCategories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Poi Categories creation failed',
            error: error.message,
        });
    }
};

export {
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getCategoryController,
    getCategoryNameByIdController,
    createMultipleCategoriesController
};