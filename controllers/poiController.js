import POI from "../models/poi_Model.js";
import PointCatecories from "../models/poi_categories.js";

export const createPOI = async (req, res) => {
    try {
        const { 
            name, category, opentime, closeTime, locationText, 
            latitude, longitude, publisherId, description, 
            ticketBookingLink, isPaid, ticketprice, gallery, isActive 
        } = req.body;

        const newPOI = new POI({
            name,
            category,
            opentime,
            closeTime,
            locationText,
            latitude,
            longitude,
            publisherId,
            description,
            ticketBookingLink,
            isPaid,
            ticketprice,
            gallery,
            isActive
        });

        const savedPOI = await newPOI.save();

        res.status(201).json({
            success: true,
            message: 'POI created successfully',
            data: savedPOI,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'POI creation failed',
            error: error.message,
        });
    }
};

export const getPOIById = async (req, res) => {
    try {
        const { id } = req.params;
        const poi = await POI.findById(id);

        if (!poi) {
            return res.status(404).json({
                success: false,
                message: 'POI not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'POI fetched successfully',
            data: poi,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'POI fetching failed',
            error: error.message,
        });
    }
};


export const updatePOI = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, category, opentime, closeTime, locationText, 
            latitude, longitude, publisherId, description, 
            ticketBookingLink, isPaid, ticketprice, gallery, isActive 
        } = req.body;

        const updatedPOI = await POI.findByIdAndUpdate(id, {
            name,
            category,
            opentime,
            closeTime,
            locationText,
            latitude,
            longitude,
            publisherId,
            description,
            ticketBookingLink,
            isPaid,
            ticketprice,
            gallery,
            isActive
        }, { new: true });

        if (!updatedPOI) {
            return res.status(404).json({
                success: false,
                message: 'POI not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'POI updated successfully',
            data: updatedPOI,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'POI update failed',
            error: error.message,
        });
    }
};

export const deletePOI = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPOI = await POI.findByIdAndDelete(id);

        if (!deletedPOI) {
            return res.status(404).json({
                success: false,
                message: 'POI not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'POI deleted successfully',
            data: deletedPOI,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'POI deletion failed',
            error: error.message,
        });
    }
};


export const getAllPOIs = async (req, res) => {
    const { latitude, longitude, longitudeDelta, latitudeDelta } = req.body;
    console.log(" poi request body: ", req.body);

    try {
        const minLatitude = latitude - latitudeDelta;
        const maxLatitude = latitude + latitudeDelta;
        const minLongitude = longitude - longitudeDelta;
        const maxLongitude = longitude + longitudeDelta;

        const query = {
            latitude: { $gte: minLatitude, $lte: maxLatitude },
            longitude: { $gte: minLongitude, $lte: maxLongitude },
            isActive: true,
        };

        const pois = await POI.find(query).exec();
        console.log("show",pois)

        // Filter out only the required fields from POIs array
        const filteredPOIs = pois.map(({ 
            _id, name, category, latitude, longitude, opentime, closeTime, 
            description, ticketBookingLink, isPaid, ticketprice, gallery 
        }) => ({
            _id,
            name,
            category,
            latitude,
            longitude,
            opentime,
            closeTime,
            description,
            ticketBookingLink,
            isPaid,
            ticketprice,
            gallery
        }));

        console.log("Filtered POI data: ", filteredPOIs);

        res.status(200).json({
            success: true,
            message: 'POIs fetched successfully',
            data: filteredPOIs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'POIs fetching failed',
            error: error.message,
        });
    }
};

export const getPOIsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const pois = await POI.find({ category });

        res.status(200).json({
            success: true,
            message: 'POIs fetched successfully',
            data: pois,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'POIs fetching failed',
            error: error.message,
        });
    }
};

export const getPOIsByPublisher = async (req, res) => {
    try {
        const { publisherId } = req.params;
        const pois = await POI.find({ publisherId });

        res.status(200).json({
            success: true,
            message: 'POIs fetched successfully',
            data: pois,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'POIs fetching failed',
            error: error.message,
        });
    }
};

// create category controller
export const createCategoryController = async (req, res) => {
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

// update category controller
export const updateCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, marker_image } = req.body;

        const updatedCategory = await PointCatecories.findByIdAndUpdate(
            id,
            { name, marker_image },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

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

// delete category controller
export const deleteCategoryController = async (req, res) => {
    try {   
        const { id } = req.params;
        const deletedCategory = await PointCatecories.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            data: deletedCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Category deletion failed',
            error: error.message,
        });
    }
};

// get all categories controller
export const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await PointCatecories.find();

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

// get category by id controller
export const getCategoryByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await PointCatecories.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category fetched successfully',
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Category fetching failed',
            error: error.message,
        });
    }
};