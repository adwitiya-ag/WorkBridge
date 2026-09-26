import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    },
    jobSeekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobSeeker",
    },
    status:{
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
    }
},{timestamps: true})


export const Application = mongoose.model("Application", applicationSchema);