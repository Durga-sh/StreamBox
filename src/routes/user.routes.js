import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { login } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar", // Ensure this matches the field name in your request
            maxCount: 1
        },
        {
            name: "coverImage", // Ensure this matches the field name in your request
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(login);

export default router;