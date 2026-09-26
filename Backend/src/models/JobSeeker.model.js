import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//Represents users looking for jobs.
const jobseekerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    profileImage: {
        type: String, //cloudinary url
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true, 
        required: true,
        index: true,
    },
    refreshToken:{
        type: String
    },
    resume: {
        type: String, //cloudinary url
    },
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    }]
},{timestamps:true})

jobseekerSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})

jobseekerSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password,this.password)
}

jobseekerSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}
jobseekerSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

export const JobSeeker = mongoose.model("JobSeeker", jobseekerSchema);