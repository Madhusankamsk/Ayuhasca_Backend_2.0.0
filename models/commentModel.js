import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    publisherId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    commentText: {
        type: String,
        required: true,
    },
    },
    {
        timestamps: true,
})


const Comment = mongoose.model('Comment', commentSchema);
export default Comment;