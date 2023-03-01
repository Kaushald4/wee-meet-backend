import { Router } from "express";
import {
    getLoggedInUser,
    login,
    signup,
} from "../controllers/userController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/auth/user", isLoggedIn, getLoggedInUser);

export default router;
