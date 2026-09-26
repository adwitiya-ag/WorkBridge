import { Router } from "express";
import {createPost, getPosts, incrementLikes} from "../controllers/communityPost.controller.js";
import { verifyJWTAny } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/", getPosts);
router.post("/",
    verifyJWTAny,
    upload.fields([{ name: 'postImage', maxCount: 1 }]),
    createPost
);
router.post("/:postId/likes", verifyJWTAny, incrementLikes);
/*
API endpoint for liking a post:
PATCH /community-posts/:postId/likes

Example:
PATCH /community-posts/12345/likes
Headers: { Authorization: 'Bearer <token>' }
*/
export default router;