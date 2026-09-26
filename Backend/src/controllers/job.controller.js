import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Job } from "../models/job.model.js";

const postJobs = asyncHandler(async (req,res,next) => {

    const {title,description,location,company,salary} = req.body
    const employerID = req.user._id

    if(!title || !description || !location || !company || !salary){
        return next(new ApiError(400,"Please provide all the required fields"))
    }
    
    const job = await Job.create({
        title,
        description,
        location,
        company,
        salary,
        postedBy: employerID
    })

    const postedJob = await Job.findById(job._id)
    if(!postedJob){
        return next(new ApiError(500,"Job posting failed"))
    }

    req.user.postedJobs.push(postedJob._id)
    const employer = await req.user.save({validateBeforeSave:false})

        if(!employer){
        return next(new ApiError(500,"Employer not found"))
    }


    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            postedJob,
            "Job posted successfully"
        )
    )
})

const getAllJobs = asyncHandler(async (req,res,next) => {

    // const jobs = await Job.find({}).populate("postedBy")
    const jobs = await Job.find({})
    // const employers = await getEmployers(jobs)
    // console.log("Employers:",employers);
    
    if(!jobs){
        return next(new ApiError(404,"No jobs found"))
    }

    // jobs.forEach((job,index) => {
    //     job.postedBy = employers[index]
    // })



    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            jobs,
            "Jobs found"
        )
    )
})

const searchJobs = asyncHandler(async (req,res,next) => {
    
    const {title,location} = req.body;
    // console.log("Search:",title,location);
    

    const matchConditions=[]
    if(title){
        matchConditions.push({title:{$regex:title,$options:"i"}})
    }
    if(location){
        matchConditions.push({location:{$regex:location,$options:"i"}})
    }

    const pipeline=[]
    if(matchConditions.length>0){
        pipeline.push({
            $match:{
                $and:matchConditions
            }
        })
    }

    pipeline.push({
        $sort:{
            createdAt:-1
        }
    })

    const jobs = await Job.aggregate(pipeline)
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            jobs,
            "Search results"
        )
    )

})

const getJobById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        return next(new ApiError(400, "Job ID is required"));
    }

    const job = await Job.findById(id);
    if (!job) {
        return next(new ApiError(404, "Job not found"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                job,
                "Job found successfully"
            )
        );
});

export {postJobs, getAllJobs, searchJobs, getJobById}