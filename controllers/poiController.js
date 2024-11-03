import asyncHandler from "express-async-handler";
import Poi from "../models/poiModel.js";
import User from "../models/userModel.js";

const createPOI = asyncHandler(async (req, res) => {
    const {
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
    } = req.body;

    console.log(req.body);

    const token = req.header('Authorization').replace('Bearer ', '');
     console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userdetails = await User.findById(decoded.userId);
        console.log(decoded.userId);
        const newPoi = await Poi.create({
            privacy,
            publisherId: decoded.userId,
            publisherName: userdetails.firstName + " " + userdetails.lastName,
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
            isActive: true
        });
        console.log(newPoi);

        res.status(201).json({
            success: true,
            message: "Poi added successfully",
            data: newEvent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Poi creation failed",
            error: error.message
        });
    }
});

const getPOIs = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { latitude, longitude, longitudeDelta, latitudeDelta, usertime, userDate } = req.body;
    console.log("request body get poi: ", req.body)

    try {
        let pois;

        const minLatitude = latitude - latitudeDelta;
        const maxLatitude = latitude + latitudeDelta;
        const minLongitude = longitude - longitudeDelta;
        const maxLongitude = longitude + longitudeDelta;

        const query = {
            //date: selectedDate ? selectedDate : { $gte: userDate },
            latitude: { $gte: minLatitude, $lte: maxLatitude },
            longitude: { $gte: minLongitude, $lte: maxLongitude },
            isActive: true, // To Filter is Active true events
        };

        if (id && id !== '0') {
            query.category = id;
        }

        pois = await Poi.find(query).exec();

        // Filter out only the required fields from events array
        const filteredPois = pois.map(({ _id, name, category, latitude, longitude, openTime, closeTime, locationText, description, gallery }) => ({
            _id,
            name,
            category,
            openTime,
            closeTime,
            locationText,
            latitude,
            longitude,
            description,
            gallery
        }));

        console.log("Filter poi data: ", filteredPois);

        res.status(200).json({
            success: true,
            message: "Poi fetched successfully",
            data: filteredPois,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Poi fetching failed',
            error: error.message,
        });
    }
});

const getPoiTiles = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { latitude, longitude, longitudeDelta, latitudeDelta } = req.body;
    console.log("request body: ", req.body)

    try {
        let pois;

        const minLatitude = latitude - latitudeDelta;
        const maxLatitude = latitude + latitudeDelta;
        const minLongitude = longitude - longitudeDelta;
        const maxLongitude = longitude + longitudeDelta;

        const query = {
            //date: selectedDate ? selectedDate : { $gte: new Date().toISOString().slice(0, 10) },
            latitude: { $gte: minLatitude, $lte: maxLatitude },
            longitude: { $gte: minLongitude, $lte: maxLongitude },
            isActive: true, // To Filter is Active true events
        };

        if (id && id !== '0') {
            query.category = id;
        }

        pois = await Poi.find(query).exec();

        // Calculate distance for each event and sort based on distance
        pois.forEach(poi => {
            poi.distance = calculateDistance(latitude, longitude, poi.latitude, poi.longitude);
        });

        // Sort events by distance
        pois.sort((a, b) => a.distance - b.distance);
        pois = pois.slice(0,5)
        //zoom in to get more events
        res.status(200).json({
            success: true,
            message: "Poi fetched successfully",
            data: pois,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Poi fetching failed',
            error: error.message,
        });
    }
});

const getEachPoi = asyncHandler(async (req, res) => {
    const { id, userId } = req.body;
    try {
        const poi = await Poi.findById({
            _id: id,
            isActive: true, 
        })

        console.log(poi);
        const user = await User.findById(userId);
        res.status(200).json({
            success: true,
            message: "Poi fetched successfully",
            data: {
                poi: poi,
                //like: poi.like.includes(userId),
                //dislike: poi.dislike.includes(userId),
                user: user,
                //go: poi.going.includes(userId),
                //interested: poi.interested.includes(userId),
                //goingList: poi.going,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Poi fetching failed",
            error: error.message
        });
    }
});

const deletePoi = asyncHandler(async (req, res) => {
    const { id } = req.params;  // Assuming the event ID is in the URL parameters
    console.log(id);
    try {
        // Find the user and decrease the total marks
        const poi = await Poi.findById(id);
        const userId = poi.publisherId;
        const user = await User.findById(userId);
        //user.addedMoments = user.addedMoments.filter(momentId => momentId.toString() !== id.toString());

        // Find the event by ID and delete it
        await Poi.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Poi deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Poi deletion failed",
            error: error.message
        });
    }
});

const searchPois = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const pois = await Poi.find({
            $and: [
                {
                    isActive: true, 
                },
                {
                    $or: [
                        { name: { $regex: '(^|\\b)' + id, $options: 'i' } },
                        { location: { $regex: '(^|\\b)' + id, $options: 'i' } }
                    ]
                }
            ]
        });
        res.status(200).json({
            success: true,
            message: "Poi fetched successfully",
            data: pois
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Poi fetching failed",
            error: error.message
        });
    }
})

export { createPOI, getPOIs, getPoiTiles, getEachPoi, deletePoi, searchPois};


// export const getPOIById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const poi = await POI.findById(id);

//         if (!poi) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'POI not found',
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'POI fetched successfully',
//             data: poi,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'POI fetching failed',
//             error: error.message,
//         });
//     }
// };


// export const updatePOI = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { 
//             name, category, opentime, closeTime, locationText, 
//             latitude, longitude, publisherId, description, 
//             ticketBookingLink, isPaid, ticketprice, gallery, isActive 
//         } = req.body;

//         const updatedPOI = await POI.findByIdAndUpdate(id, {
//             name,
//             category,
//             opentime,
//             closeTime,
//             locationText,
//             latitude,
//             longitude,
//             publisherId,
//             description,
//             ticketBookingLink,
//             isPaid,
//             ticketprice,
//             gallery,
//             isActive
//         }, { new: true });

//         if (!updatedPOI) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'POI not found',
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'POI updated successfully',
//             data: updatedPOI,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'POI update failed',
//             error: error.message,
//         });
//     }
// };

// export const deletePOI = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedPOI = await POI.findByIdAndDelete(id);

//         if (!deletedPOI) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'POI not found',
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'POI deleted successfully',
//             data: deletedPOI,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'POI deletion failed',
//             error: error.message,
//         });
//     }
// };


// export const getAllPOIs = async (req, res) => {
//     const { latitude, longitude, longitudeDelta, latitudeDelta } = req.body;
//     console.log(" poi request body: ", req.body);

//     try {
//         const minLatitude = latitude - latitudeDelta;
//         const maxLatitude = latitude + latitudeDelta;
//         const minLongitude = longitude - longitudeDelta;
//         const maxLongitude = longitude + longitudeDelta;

//         const query = {
//             latitude: { $gte: minLatitude, $lte: maxLatitude },
//             longitude: { $gte: minLongitude, $lte: maxLongitude },
//             isActive: true,
//         };

//         const pois = await POI.find(query).exec();
//         console.log("show",pois)

//         // Filter out only the required fields from POIs array
//         const filteredPOIs = pois.map(({ 
//             _id, name, category, latitude, longitude, opentime, closeTime, 
//             description, ticketBookingLink, isPaid, ticketprice, gallery 
//         }) => ({
//             _id,
//             name,
//             category,
//             latitude,
//             longitude,
//             opentime,
//             closeTime,
//             description,
//             ticketBookingLink,
//             isPaid,
//             ticketprice,
//             gallery
//         }));

//         console.log("Filtered POI data: ", filteredPOIs);

//         res.status(200).json({
//             success: true,
//             message: 'POIs fetched successfully',
//             data: filteredPOIs,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'POIs fetching failed',
//             error: error.message,
//         });
//     }
// };

// export const getPOIsByCategory = async (req, res) => {
//     try {
//         const { category } = req.params;
//         const pois = await POI.find({ category });

//         res.status(200).json({
//             success: true,
//             message: 'POIs fetched successfully',
//             data: pois,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'POIs fetching failed',
//             error: error.message,
//         });
//     }
// };

// export const getPOIsByPublisher = async (req, res) => {
//     try {
//         const { publisherId } = req.params;
//         const pois = await POI.find({ publisherId });

//         res.status(200).json({
//             success: true,
//             message: 'POIs fetched successfully',
//             data: pois,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'POIs fetching failed',
//             error: error.message,
//         });
//     }
// };
