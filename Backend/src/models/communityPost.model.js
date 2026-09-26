import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "postedByRole",
    },
    postedByRole: {
        type: String,
        enum: ["JobSeeker", "Employer"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    postImage: {
        type: String, // cloudinary url
        required: false,
    },
    // likes: {
    //     type: Number,
    //     default: 0
    // },
    likes: [
        {
            likedBy: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: "likes.likedByRole",
            },
            likedByRole: {
                type: String,
                enum: ["JobSeeker", "Employer"],
                required: true,
            },
        },
    ],

    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            content: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

export const CommunityPost = mongoose.model(
    "CommunityPost",
    communityPostSchema
);
