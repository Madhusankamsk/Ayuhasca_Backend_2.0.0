import mongoose from "mongoose";


const eventCatecoriesSchema = mongoose.Schema(
    {
        name: { 
            type: String,
            required: true,
        },
        category_id: {
            type: Number,
            required: true,
        }
    },
    );

const EventCatecories = mongoose.model("EventCatecories", eventCatecoriesSchema);