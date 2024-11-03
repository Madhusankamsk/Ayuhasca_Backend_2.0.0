import mongoose from 'mongoose';

const pointSchema = mongoose.Schema(
    {
        publisherId: {
            type: String,
            required: true,
        },
        publisherName: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        openTime: {
            type: String,
            required: true,
        },
        closeTime: {
            type: String,
            required: true,
        },
        locationText: {
            type: String,
            // required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        ticketBookingLink: {
            type: String,
            default: '',
        },
        isPaid: {
            type: Boolean,
            required: true,
        },
        ticketprice: {
            type: [Number],
            default: [],
        },
        gallery: {
            type: String,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

const Point = mongoose.model('Point', pointSchema);
export default Point;
