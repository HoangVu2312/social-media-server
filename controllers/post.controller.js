import Post from "../models/Post.js";
import User from "../models/User.js";

// CREATE
export const createPost = async (req, res) => {
    try {
        // step 1: destructure data from front end
        const {userId, description, picturePath} = req.body;

        // step 2: find the user who create this post
        const user = await User.findById(userId);

        // step 3: create a new post 
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,  // post picture-path
            likes: {},
            commments: []
        });

        // step 4: save the new post to mongoose db
        await newPost.save();

        // step 5: send the updated post (of all users) list back to front end
        const posts = await Post.find();
        res.status(201).json(posts);

    } catch (err) {
        res.status(409).json({message: err.message})
    }
}

// READ - get all posts
export const getFeedPosts = async (req, res) => {
    try{
        // find all the posts (of all users) and send back to front end
        const posts = await Post.find();
        res.status(201).json(posts);

    } catch (err) {
        res.status(404).json({message: err.message})
    }
}

// Get one user's posts
export const getUserPosts = async (req, res) => {
    try{
        // find all the posts (of one user) and send back to front end
        const {userId} = req.params;
        const userPosts = await Post.find({userId});
        res.status(201).json(userPosts);

    } catch (err) {
        res.status(404).json({message: err.message})
    }
}

// UPDATE
export const likePost = async (req, res) => {
    try{
        // step 1: destructure id of the post and userId (who likes the post) from front end
        const {id} = req.params;
        const {userId} = req.body;

        // step 2: find the post and list of users likes that post
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
         
        // step 3: check if user already liked the post or not
        if (isLiked) {
            post.likes.delete(userId); //liked => unlike 
        }
        else {
            post.likes.set(userId, true); // => put userId in liked List (Map)
        }

        // step 4: update the post and send back to front end
        const updatedPost = await Post.findByIdAndUpdate(
            id,  // -> find the post to update
            { likes: post.likes},
            { new : true }
        );

        res.status(201).json(updatedPost);

    } catch (err) {
        res.status(404).json({message: err.message})
    }
}