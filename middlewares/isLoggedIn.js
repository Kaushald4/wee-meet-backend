import User from "../models/User.js";
import JWT from "jsonwebtoken";
import { config } from "../config/index.js";

export const isLoggedIn = async (req, res, next) => {
    try {
        let token = req.headers.authorization || req.cookies?.token;

        if (!token) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Token" });
        }

        token = token.replace("Bearer", "")?.trim();

        let decoded = JWT.verify(token, config.JWT_SECRET);

        let user = await User.findById(decoded.id);
        user.password = "";
        req.auth = user;
        next();
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};
