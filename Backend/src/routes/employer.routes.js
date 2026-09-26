import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerEmployer, loginEmployer, logoutEmployer, getEmployer, getEmployerApplicants } from "../controllers/employer.controller.js";
import { verifyJWTEmployer } from "../middlewares/auth.middleware.js";

const router = Router()

// Register an employer with optional profile image / company logo
router.route("/register").post(
    upload.fields([{ name: 'profileImage', maxCount: 1 }]),
    registerEmployer
)

router.route("/login").post(upload.none(), loginEmployer)

router.route("/logout").post(verifyJWTEmployer, logoutEmployer)

router.route("/getEmployer").get(verifyJWTEmployer, getEmployer)

router.route("/applicants").get(verifyJWTEmployer, getEmployerApplicants)

export default router