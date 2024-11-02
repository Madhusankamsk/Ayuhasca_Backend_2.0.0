import mongoose from "mongoose";


const pointCatecoriesSchema = mongoose.Schema(
    {
        name: { 
            type: String,
            required: true,
        },
        id: {
            type: Number,
            required: true,
        },
        marker_image: {
            type: String,
        }
    },
    );

const PointCatecories = mongoose.model("PointCatecories", pointCatecoriesSchema);
export default PointCatecories;