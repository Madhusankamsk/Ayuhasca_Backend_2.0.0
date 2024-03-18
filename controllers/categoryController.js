import EventCatecories from "../models/eventCatecories.js";

const createCategoryController = async (req, res) => {
    try {
        const { name, id } = req.body;

        const newCategory = new EventCatecories({
            name,
            id,
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
        const { name, id } = req.body;

        const updatedCategory = await EventCatecories.findByIdAndUpdate(
            _id,
            { name, id },
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

export {
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getCategoryController
};