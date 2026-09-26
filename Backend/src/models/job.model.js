import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    company: {
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    salary:{
        type: Number,
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employer",
    }
},{timestamps: true})

export const Job = mongoose.model("Job", jobSchema);