import Report from "../models/reportModel.js";

const createReportController = async (req, res) => {
    try {
        const { report_user_id, 
            report_event_id, 
            event_created_user_id,
            report_type,
            report_message,
        } = req.body;

        const newReport = new Report({
            report_user_id, 
            report_event_id,
            event_created_user_id,
            report_type,
            report_message,
        });

        const savedReport = await newReport.save();

        res.status(201).json({
            success: true,
            message: 'Report created successfully',
            data: savedReport,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Report creation failed',
            error: error.message,
        });
    }
};

const updateReportController = async (req, res) => {
    try {
        const { _id } = req.body;
        const { report_user_id, 
            report_event_id, 
            event_created_user_id,
            report_type,
            report_message,
        } = req.body;

        const updatedReport = await Report.findByIdAndUpdate(
            _id,
            { report_user_id, 
                report_event_id, 
                event_created_user_id,
                report_type,
                report_message,},
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Report updated successfully',
            data: updatedReport,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Report update failed',
            error: error.message,
        });
    }
};

const deleteReportController = async (req, res) => {
    try {
        const { id } = req.params;

        await Report.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Report deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Report deletion failed',
            error: error.message,
        });
    }
}

const getReportController = async (req, res) => {
    try {
        const report = await Report.find();

        res.status(200).json({
            success: true,
            message: 'Report fetched successfully',
            data: report,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Report fetching failed',
            error: error.message,
        });
    }
};

const getReportByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const reportId = parseInt(id, 10);
        const report = await Report.findOne({ id });
        //const categoryName = report.name
        console.log("report id: " + reportId);
        console.log("report: " + report);
        //console.log("category name: " + categoryName);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Report fetched successfully',
            data: report,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Report fetching failed',
            error: error.message,
        });
    }
};

export {
    createReportController,
    updateReportController,
    deleteReportController,
    getReportController,
    getReportByIdController
};