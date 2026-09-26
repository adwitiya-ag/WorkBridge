import { Employer } from "../models/employer.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { JobSeeker } from "../models/JobSeeker.model.js";

const generateAccessandRefreshToken = async(userId) => {
    try {
        const employer = await Employer.findById(userId)

        const accessToken = await employer.generateAccessToken()
        const refreshToken = await employer.generateRefreshToken()

        employer.refreshToken = refreshToken
        await employer.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Token generation failed")
    }
}

const registerEmployer = asyncHandler(async(req,res,next) => {

    const {name,email,password,company} = req.body
    // console.log(name,email,password,company);
    

    if(!name || !email || !password || !company){
        return next(new ApiError(400,"Please provide all the required fields"))
    }

    const existedEmployer = await Employer.findOne({email})
    if(existedEmployer){
        throw new ApiError(400,"Employer already existed")
    }

    let profileImageUrl = null;
    const profileImgLocalPath = req?.files?.profileImage?.[0]?.path || req?.file?.path;
    if (profileImgLocalPath) {
        const uploaded = await uploadOnCloudinary(profileImgLocalPath);
        profileImageUrl = uploaded?.secure_url || uploaded?.url || null;
    }

    const user = await Employer.create({
        name,
        email,
        password,
        company,
        profileImage: profileImageUrl
    })

    await user.save()

    const createdEmployer = await Employer.findById(user._id).select("-password")
    if(!createdEmployer){
        throw new ApiError(500,"Employer not created")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201,createdEmployer,"Employer created successfully")
    )
})

const loginEmployer = asyncHandler(async(req,res,next) => {
    const {email,password} = req.body

    if(!email || !password){
        return next(new ApiError(400,"Please provide all the required fields"))
    }

    const user = await Employer.findOne({email})
    if(!user){
        throw new ApiError(400,"Employer not found")
    }

    const isPasswordValid = await user.isPasswordMatch(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid Credentials")
    }

    const {accessToken,refreshToken} = await generateAccessandRefreshToken(user._id)

    const loggedInUser = await Employer.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        // secure: true
        sameSite: "lax",
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

const logoutEmployer = asyncHandler(async(req,res,next) => {

    await Employer.findByIdAndUpdate(
        req.user._id,
        {
            $set: {refreshToken: undefined}
        },
        {
            new: true
        }
    )

    const options ={
        httpOnly: true,
        // secure: true,
        sameSite: "lax",
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "Employer logged out successfully"
        )
    )
})

const getEmployer = asyncHandler(async (req, res, next) => {
    const eId = req.user._id;
    
    if(!eId) return next(new ApiError(400, "Employer ID is required"));
    const employer = await Employer.findById(eId)
                    .select("-password -refreshToken")
                    .populate("postedJobs");
    
    if(!employer) return next(new ApiError(404, "Employer not found"));
    return res.status(200).json(
        new ApiResponse(200, employer, "Employer fetched successfully")
    );
})

const getEmployerApplicants = asyncHandler(async (req, res, next) => {
    const employer = await Employer.findById(req.user._id).populate("postedJobs");
    if (!employer) return next(new ApiError(404, "Employer not found"));

    const jobIds = (employer.postedJobs || []).map(job => job._id);

    // Find all JobSeekers who applied to any of these jobs
    const applicants = await JobSeeker.find({
        appliedJobs: { $in: jobIds }
    }).select("-password -refreshToken").populate("appliedJobs");

    return res.status(200).json(
        new ApiResponse(200, applicants, "Applicants fetched successfully")
    );
});

export {registerEmployer,loginEmployer,logoutEmployer, getEmployer, getEmployerApplicants}