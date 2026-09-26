import { Router } from "express";
import { postJobs, getAllJobs, searchJobs, getJobById} from "../controllers/job.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWTEmployer} from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/postJobs").post(verifyJWTEmployer,upload.none(),postJobs)
router.route("/").get(getAllJobs)
router.route("/search").post(upload.none(),searchJobs)
router.route("/:id").get(getJobById)

export default router