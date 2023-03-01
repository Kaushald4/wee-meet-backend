import mongoose, { Schema } from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config/index.js";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
        },
        profileURL: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 8);
    next();
});

UserSchema.methods = {
    generateJWTToken: function () {
        const token = JWT.sign({ id: this._id }, config.JWT_SECRET, {
            expiresIn: "29d",
        });
        return token;
    },

    comparePassword: async function (plainPassword) {
        return await bcrypt.compare(plainPassword, this.password);
    },
};

export default mongoose.model("User", UserSchema);
