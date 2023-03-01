import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema(
    {
        meetingCode: {
            type: String,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Meeting", MeetingSchema);
