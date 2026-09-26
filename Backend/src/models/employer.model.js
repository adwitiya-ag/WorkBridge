import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
//Represents users who post job listings.
const employerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        // required: true,
    },
    profileImage: {
        type: String, // cloudinary url
    },
    refreshToken:{
        type: String
    },
    postedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    }]
},{timestamps: true})

employerSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

employerSchema.methods.isPasswordMatch = async function(password) {
    return await bcrypt.compare(password,this.password)
}

employerSchema.methods.generateAccessToken = async function(){
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
employerSchema.methods.generateRefreshToken = async function(){
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
export const Employer = mongoose.model("Employer", employerSchema);