import mongoose from 'mongoose';

const feedback = mongoose.Schema(
    {
        userId : {
            type: String,
            required: true,
        },
        userInput : {
            type: String,
            required: true,
        },
        selectedOption : {
            type: String,
            required: true,
        },
        selectedImage : {
            type: String,
            default: '',
        }
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

const FeedBack = mongoose.model('FeedBack', feedback);
export default FeedBack;
