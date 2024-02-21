import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    publisherId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    eventId: {type: mongoose.Schema.Types.ObjectId, ref: 'Event'},
    privacy: {
        type: Boolean,
        //required: true,
    },
    eventname: {
        type: String,
        //required: true,
    },
    postText: {
        type: String,
       // required: true,
    },
    postMedia: {
        type: [String],
        default: [],
    },
    isEvent: {
        type: Boolean,
        default: false,
    },
    likes: {
        type: [String],
        default: [],
    },
    },
    {
        timestamps: true,
    }
)

const Post = mongoose.model('Post', postSchema);
export default Post;