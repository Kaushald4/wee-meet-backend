import Meeting from "../models/Meeting.js";
import { v4 } from "uuid";
import { generateMeetingLink } from "../utils/generateMeetingLink.js";

export const createMeeting = async (req, res) => {
    try {
        const id = v4();
        const meetingLink = generateMeetingLink();

        let meeting = await Meeting.create({
            meetingCode: meetingLink,
            author: req.auth._id,
        });

        res.status(201).json({ success: true, data: meeting });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

export const getMeetingInfo = async (req, res) => {
    try {
        const { meetingCode } = req.body;

        const meetingInfo = await Meeting.findOne({ meetingCode }).populate(
            "author"
        );

        res.status(200).json({ success: true, data: meetingInfo });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};
