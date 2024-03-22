import mongoose from "mongoose";


const eventCatecoriesSchema = mongoose.Schema(
    {
        name: { 
            type: String,
            required: true,
        },
        id: {
            type: Number,
            required: true,
        }
    },
    );

const EventCatecories = mongoose.model("EventCatecories", eventCatecoriesSchema);
export default EventCatecories;