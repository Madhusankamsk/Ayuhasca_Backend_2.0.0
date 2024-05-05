import Report from "../models/reportModel.js";
import Event from "../models/eventModel.js";

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
        const combinedQuery = [
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
                $project: {
                    _id: 1,
                    publisherId: 1,
                    eventname: 1,
                    category: 1,
                    reports: 1,
                    report_count: 1,
                },
            },
            {
                $sort: { report_count: -1 } 
            },
        ];

        const eventsWithReport = await Event.aggregate(combinedQuery);
        console.log(eventsWithReport);

        res.status(200).json({
            success: true,
            message: 'Events fechiching with reports',
            data: eventsWithReport,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'event fetching failed',
            error: error.message,
        });
    }
};

export {
    getReportController,
    getEventReportController,
};