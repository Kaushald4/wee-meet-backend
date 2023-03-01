import { config } from "../config/index.js";

const sendJwtToken = (user, res) => {
    const jwtToken = user.generateJWTToken();
    const cookieTime = parseInt(config.COOKIE_TIME);

    let cookieOptions = {};
    if (config.NODE_ENV === "development") {
        cookieOptions["httpOnly"] = true;
        cookieOptions["expires"] = new Date(
            Date.now() + cookieTime * 24 * 60 * 60 * 1000
        );
    } else {
        cookieOptions["sameSite"] = "none";
        cookieOptions["expires"] = new Date(
            Date.now() + cookieTime * 24 * 60 * 60 * 1000
        );
        cookieOptions["secure"] = true;
    }

    //set token in cookie
    res.status(200)
        // .cookie("token", `Bearer ${jwtToken}`, cookieOptions)
        .json({ success: true, data: { ...user._doc, jwtToken } });
};

export { sendJwtToken };
