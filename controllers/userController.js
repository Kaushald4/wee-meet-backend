import User from "../models/User.js";
import { sendJwtToken } from "../utils/sendJwtToken.js";

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res
                .status(400)
                .json({ success: false, message: "All Fields are required!" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: `User with ${email} already exist!`,
                });
        }

        user = await User.create({
            name,
            email,
            password,
        });

        sendJwtToken(user, res);
    } catch (e) {
        console.log(e);
        res.status(200).json({ success: false, message: e.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "All Fields are required!" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: `User with ${email} doesn't exist!`,
                });
        }

        let isValid = await user.comparePassword(password);
        if (!isValid) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Credentials" });
        }

        sendJwtToken(user, res);
    } catch (e) {
        res.status(200).json({ success: false, message: e.message });
    }
};

export const getLoggedInUser = async (req, res) => {
    try {
        res.status(200).json({ success: true, data: req.auth });
    } catch (e) {
        res.status(200).json({ success: false, message: e.message });
    }
};
