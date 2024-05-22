import Report from "../models/reportModel.js";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";

const getReportController = async (req, res) => {
    try {
        const combinedQuery = [
            {
                $lookup: {
                    from: 'users',
                    let: { reportedUserID: '$report_user_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$reportedUserID'] },
                            },
                        },
                        {
                            $project: {
                                email: 1,
                                _id: 0,
                            },
                        },
                    ],
                    as: 'reported_user',
                },
            },
            {
                $addFields: {
                    reported_user: { $arrayElemAt: ['$reported_user', 0] },
                },
            },
            {
                $lookup: {
                    from: 'events',
                    let: { reportID: '$report_event_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$reportID'] },
                            },
                        },
                        {
                            $project: {
                                eventname: 1,
                                _id: 0,
                            },
                        },
                    ],
                    as: 'reported_event',
                },
            },
            {
                $addFields: {
                    reported_event: { $arrayElemAt: ['$reported_event', 0] },
                },
            },
        ];

        const reportsWithJoins = await Report.aggregate(combinedQuery);
        console.log(reportsWithJoins);

        res.status(200).json({
            success: true,
            message: 'Report fetched successfully with joins',
            data: reportsWithJoins,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Report fetching failed',
            error: error.message,
        });
    }
};

const getEventReportController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const startIndex = (page - 1) * limit;
        console.log("page number: " + page);
        console.log(" startIndex : " + startIndex);
        const search = req.query.search;
        console.log("Search Item: " + search);
        const activeStatus = req.query.activeStatus === 'true';
        console.log("activeStatus: " + activeStatus);

        const combinedQuery = [
            {
                $match: {
                    isActive: activeStatus,
                },
            },
            {
                $lookup: {
                    from: 'reports',
                    let: { eventID: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$report_event_id', '$$eventID'] },
                            },
                        },
                        {
                            $project: {
                                report_user_id: 1,
                                report_type: 1,
                                report_message: 1,
                                _id: 0,
                            },
                        },
                    ],
                    as: 'reports',
                },
            },
            {
                $addFields: {
                    report_count: { $size: '$reports' },
                },
            },
            {
                $sort: { report_count: -1 },
            },
        ];

        // Add search filter if search query is provided
        if (search) {
            combinedQuery.unshift({
                $match: {
                    $or: [
                        { eventname: { $regex: '(^|\\b)' + search, $options: 'i' } },
                        { features: { $elemMatch: { $regex: '(^|\\b)' + search, $options: 'i' } } },
                        { location: { $regex: '(^|\\b)' + search, $options: 'i' } },
                        { publisherName: { $regex: '(^|\\b)' + search, $options: 'i' } },
                        { publisherId: { $regex: '(^|\\b)' + search, $options: 'i' } },
                    ]
                }
            });
        }

        const eventsWithReport = await Event.aggregate(combinedQuery);
        const eventsFeed = eventsWithReport.slice(startIndex, startIndex + limit);
        console.log(eventsFeed);
        const totalEvents = await Event.countDocuments();
        const totalPages = Math.ceil(totalEvents / limit);

        res.status(200).json({
            success: true,
            message: 'Events fetched with reports',
            data: eventsFeed,
            page,
            totalPages,
            limit,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Event fetching failed',
            error: error.message,
        });
    }
};

const blockEventController = async (req, res) => {
    try {
        const { _id, isActive } = req.body;

        const toggleEventVisible = await Event.findByIdAndUpdate(
            _id,
            {
                isActive,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Toggled Event successfully',
            data: toggleEventVisible,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Event update failed',
            error: error.message,
        });
    }
};

const blockEventAddEvent = async (req, res) => {
    try {
        const { _id, isAddFakeEvent } = req.body;

        const toggleAddEvent = await User.findByIdAndUpdate(
            _id,
            {
                isAddFakeEvent,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Toggled Event successfully',
            data: toggleAddEvent,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Event update failed',
            error: error.message,
        });
    }
};


const whereIsUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'currentLatitude currentLongitude birthday');

        const userLocationsAndAges = users.map(user => {
            const ageDifMs = Date.now() - new Date(user.birthday).getTime();
            const ageDate = new Date(ageDifMs); // miliseconds from epoch
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);

            return {
                latitude: user.currentLatitude,
                longitude: user.currentLongitude,
                age: age,
            };
        });

        res.status(200).json({
            success: true,
            data: userLocationsAndAges,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve user locations and ages',
            error: error.message,
        });
    }
};


export {
    getReportController,
    getEventReportController,
    blockEventController,
    blockEventAddEvent,
    whereIsUsers
};