import EventCatecories from "../models/eventCatecories.js";

const createCategoryController = async (req, res) => {
    try {
        const { name, id, marker_image } = req.body;

        const newCategory = new EventCatecories({
            name,
            id,
            marker_image,
        });

        const savedCategory = await newCategory.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: savedCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Category creation failed',
            error: error.message,
        });
    }
};

const updateCategoryController = async (req, res) => {
    try {
        const { _id } = req.body;
        const { name, id , marker_image } = req.body;

        const updatedCategory = await EventCatecories.findByIdAndUpdate(
            _id,
            { name, id , marker_image},
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Category update failed',
            error: error.message,
        });
    }
};

const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        await EventCatecories.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Category deletion failed',
            error: error.message,
        });
    }
}

const getCategoryController = async (req, res) => {
    try {
        const categories = await EventCatecories.find();

        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Categories fetching failed',
            error: error.message,
        });
    }
};

const getCategoryNameByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryId = parseInt(id, 10);
        const category = await EventCatecories.findOne({ id });
        const categoryName = category.name
        console.log("category id: " + categoryId);
        console.log("category: " + category);
        console.log("category name: " + categoryName);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Categories Name fetched successfully',
            data: categoryName,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Categories Name fetching failed',
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

            const newCategory = new EventCatecories({
                name,
                id,
                marker_image,
            });

            const savedCategory = await newCategory.save();
            savedCategories.push(savedCategory);
        }

        res.status(201).json({
            success: true,
            message: 'Categories created successfully',
            data: savedCategories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Categories creation failed',
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