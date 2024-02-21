import mongoose from 'mongoose';


const feedCollectionSchema = mongoose.Schema({
    userID:{
        type: String,
        required: true,
    },
    postID:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    }
},{
    timestamps: true,
}
)


const FeedCollection = mongoose.model('FeedCollection', feedCollectionSchema);
export default FeedCollection;