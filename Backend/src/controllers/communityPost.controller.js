import { CommunityPost } from "../models/communityPost.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const createPost = asyncHandler(async (req, res, next) => {
    const {content} = req.body;
    if(!content) return next(new ApiError(400, "Content is required"));

    const post = await CommunityPost.create({
        postedBy: req.user._id,
        postedByRole: req.userType,
        content,
        likes: [],
        comments: []
    })

    if(!post) return next(new ApiError(500, "Post creation failed"));

    res.status(201).json({
        status: 201,
        data: post,
        message: "Post created successfully"
    })
})

const getPosts = asyncHandler(async (req, res, next) => {
    const posts = await CommunityPost.find({})
        .populate("postedBy")
        .sort({ createdAt: -1 });

    if(!posts) return next(new ApiError(404, "No posts found"));

    res.status(200).json({
        status: 200,
        data: posts,
        message: "Posts retrieved successfully"
    })
})

const incrementLikes = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    // const { userId, userType } = req.body;

    const userId = req.user._id; 
    const userType = req.userType; 

    if (!postId || !userId || !userType) {
        return next(new ApiError(400, "Post ID, User ID, and User Type are required"));
    }

    const post = await CommunityPost.findById(postId);
    if (!post) return next(new ApiError(404, "Post not found"));

    const existingIndex = post.likes.findIndex(
        (like) =>
            like.likedBy.toString() === req.user._id.toString() &&
            like.likedByRole === req.userType
    );

    if (existingIndex !== -1) {
        // Unlike (remove the like) as an index is found
        post.likes.splice(existingIndex, 1);
    } else {
        // Like (add a like) as an index is not found
        post.likes.push({ likedBy: userId, likedByRole: userType });
    }

    await post.save();

    res.status(200).json({
        status: 200,
        data: post,
        message: existingIndex !== -1 ? "Post unliked" : "Post liked",
    });
});


export {createPost, getPosts, incrementLikes}