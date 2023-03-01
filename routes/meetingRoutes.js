import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
    createMeeting,
    getMeetingInfo,
} from "../controllers/meetingController.js";

const router = Router();

router.post("/meeting", isLoggedIn, createMeeting);
router.post("/meeting/info", getMeetingInfo);

export default router;
