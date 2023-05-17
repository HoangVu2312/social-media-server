import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
{
    // id (of each post) is primary key => auto generated in mongoose
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
 
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
        type: Map, // Map is basically an Array => which user like this post => add to this Map
        of: Boolean,
    },
    comments: {
        type: Array,
        default: []
    }
},
{
    timestamps: true
}
);

// Create a Post table in mongoose    
const Post = mongoose.model("Post", postSchema);

export default Post;