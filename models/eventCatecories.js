import mongoose from "mongoose";


const eventCatecoriesSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        }
    },
    );

const EventCatecories = mongoose.model("EventCatecories", eventCatecoriesSchema);