import mongoose from 'mongoose';

const reportSchema = mongoose.Schema(
    {
        report_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        report_event_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        event_created_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        is_fake: {
            type: Boolean,
            required: true,
        },
        report_message: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);


const Report = mongoose.model('Report', reportSchema);

export default Report;