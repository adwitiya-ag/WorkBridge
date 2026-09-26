import {asyncHandler} from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {JobSeeker} from '../models/JobSeeker.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';
import { Job } from '../models/job.model.js';
import { Employer } from '../models/employer.model.js';

const generateAccessandRefreshToken = async(userId)=> {
    try {
        const user = await JobSeeker.findById(userId)
    
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
    
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Token generation failed")
    }
}


const registerUser = asyncHandler(async (req,res,next)=>{
    const {name,email,password} = req.body

    if(!name || !email || !password){
        return next(new ApiError(400,"Please provide all the required fields"))
    }

    const existedUser = await JobSeeker.findOne({email})
    if(existedUser){
        throw new ApiError(400,"User already existed")
    }

    const profileImgLocalPath = req?.files?.profileImage?.[0].path
    const resumeLocalPath = req?.files?.resume?.[0].path

    if(!resumeLocalPath){
        return next(new ApiError(400,"Please provide a resume"))
    }

    if(!profileImgLocalPath){
        return next(new ApiError(400,"Please provide a profile image"))
    }
    const profileImgUrl = await uploadOnCloudinary(profileImgLocalPath)
    const resumeUrl = await uploadOnCloudinary(resumeLocalPath)


    if (!profileImgUrl || (!profileImgUrl.secure_url && !profileImgUrl.url)) {
        throw new ApiError(400, "Profile image upload failed. Please try again.");
    }
    
    if (!resumeUrl || (!resumeUrl.secure_url && !resumeUrl.url)) {
        throw new ApiError(400, "Resume upload failed. Please upload a valid PDF or document.");
    }

    const user = await JobSeeker.create({
        name,
        email,
        password,
        profileImage: profileImgUrl.secure_url || profileImgUrl.url,
        resume: resumeUrl.secure_url || resumeUrl.url
    })

    const createdUser = await JobSeeker.findById(user._id).select("-password")
    if(!createdUser){
        throw new ApiError(500,"User not created")
    }
    return res.status(201).json(new ApiResponse(201,createdUser,"User created successfully"))
})

const loginUser = asyncHandler(async (req,res,next)=> {
    const {email,password} = req.body

    if(!email || !password){
        return next(new ApiError(400,"Please provide all the required fields"))
    }
    
    const user = await JobSeeker.findOne({email})
    if(!user){
        throw new ApiError(404,"User not found")
    }

    const isPasswordValid = await user.isPasswordMatch(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid credentials")
    }
    
    const {accessToken,refreshToken} = await generateAccessandRefreshToken(user._id)

    const loggedInUser = await JobSeeker.findById(user._id)
    .select("-password -refreshToken")
    .populate("appliedJobs")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }

    

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, 
                refreshToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req,res,next) => {

    await JobSeeker.findByIdAndUpdate(
        req.user._id,
        {
            $set: {refreshToken: undefined}
        },
        {new: true}
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully"
        )
    )
})

const appliedToJob = asyncHandler(async (req,res,next) => {
    // const {jobId} = req.body
    // console.log("Req Body in appliedToJob: ",req.body);    
    const jobId = req.body.jobId;
    console.log("Job ID in appliedToJob: ",jobId);
    

    if(!jobId){
        return next(new ApiError(400,"Please provide job id"))
    }

    const job = await Job.findById(jobId)
    if(!job){
        throw new ApiError(404,"Job not found")
    }

    // console.log(job);
    const userId = req.user._id

    const user = await JobSeeker.findById(userId)
    // console.log("User in appliedToJob: ",user);
    
    if(!user){
        throw new ApiError(404,"User not found")
    }
    const updatedJobSeeker = await JobSeeker.findByIdAndUpdate(
        userId,
        {
            $addToSet: {appliedJobs: jobId}
        },
        {new: true}
    )

    if(!updatedJobSeeker){
        throw new ApiError(500,"Failed to apply to job")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedJobSeeker,
            "Applied to job successfully"
        )
    )
})

const getUser = asyncHandler(async (req,res,next)=>{
    const userId = req.user._id
    if(!userId){
        return next(new ApiError(400,"Please provide user id"))
    }
    const user = await JobSeeker.findById(userId)
                    .select("-password -refreshToken")
                    .populate("appliedJobs")
    // console.log("User in getUser: ", user);
    
    if(!user){
        throw new ApiError(404,"User not found")
    }

    return res.status(200).json(new ApiResponse(200,user,"User fetched successfully"))
})


export {registerUser, loginUser, logoutUser, appliedToJob, getUser} 