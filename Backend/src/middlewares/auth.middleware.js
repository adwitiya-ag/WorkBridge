import { Employer } from "../models/employer.model.js";
import { JobSeeker } from "../models/JobSeeker.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        // console.log("Token", token);        

        if(!token){
            throw new ApiError(401,"Access token not found")
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await JobSeeker.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(404,"Invalid Access Token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

const verifyJWTEmployer = asyncHandler(async (req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        // console.log("Token Employer", token);

        if(!token){
            throw new ApiError(401,"Access token not found")
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await Employer.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(404,"Invalid Access Token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

const verifyJWTAny = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(401, "Access token not found");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid access token");
    }

    // Try JobSeeker first
    let user = await JobSeeker.findById(decodedToken?._id).select("-password -refreshToken");
    if (user) {
        req.user = user;
        req.userType = "JobSeeker";
        return next();
    }

    // Try Employer
    user = await Employer.findById(decodedToken?._id).select("-password -refreshToken");
    if (user) {
        req.user = user;
        req.userType = "Employer";
        return next();
    }

    throw new ApiError(404, "Invalid Access Token");
});

export { verifyJWT, verifyJWTEmployer, verifyJWTAny }