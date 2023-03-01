import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://wee-meet.netlify.app", "http://localhost:5173"],
        credentials: true,
        preflightContinue: true,
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
        allowedHeaders: ["access-control-allow-origin"],
    },
});

const PORT = 4000;

import { connectDB } from "./config/db.js";

// app middleware
if (process.env.NODE_ENV === "development") {
    app.use(cors({ origin: "http://localhost:5173", credentials: true }));
} else {
    app.use(
        cors({
            origin: "https://wee-meet.netlify.app",
            credentials: true,
            preflightContinue: true,
        })
    );
}
app.use(express.json());
app.use(cookieParser());

// import all routes
import userRoutes from "./routes/userRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";

// routes middleware
app.use("/api/v1", userRoutes);
app.use("/api/v1", meetingRoutes);

const nameToSocketId = new Map();
const socketIdToName = new Map();
const meetingSessions = {};

io.on("connection", (socket) => {
    console.log("New User Joined ", socket.id);
    socket.on("join:meeting", (data) => {
        const { name, meetingCode } = data;
        nameToSocketId.set(name, socket.id);
        socketIdToName.set(socket.id, name);
        socket.join(meetingCode);
        socket.to(meetingCode).emit("user:joined", { name });
        socket.emit("joined", { name });
    });

    socket.on("join:request", (data) => {
        const { name, toUser, meetingCode } = data;
        io.to(nameToSocketId.get(toUser)).emit("incoming:join:request", {
            name,
            socketId: socket.id,
        });
    });

    socket.on("join:request:accept", (data) => {
        const { name, socketId } = data;
        io.to(socketId).emit("join:request:accept");
    });

    // spd offer exchange
    socket.on("call-offer", (data) => {
        const { toUser, fromUser, offer } = data;
        socket
            .to(nameToSocketId.get(toUser))
            .emit("incoming-offer", { fromUser, socketId: socket.id, offer });
    });

    socket.on("offer-accepted", (data) => {
        const { toUser, answer } = data;
        socket
            .to(nameToSocketId.get(toUser))
            .emit("offer-accepted", { answer });
    });

    socket.on("negotiation:needed", (data) => {
        const { toUser, offer } = data;
        socket
            .to(nameToSocketId.get(toUser))
            .emit("negotiation:needed", { offer });
    });
    socket.on("negotiation-result", (data) => {
        const { toUser, answer } = data;
        socket
            .to(nameToSocketId.get(toUser))
            .emit("negotiation-result", { answer });
    });

    socket.on("icecandidate", (data) => {
        const { toUser, candidate } = data;
        socket
            .to(nameToSocketId.get(toUser))
            .emit("icecandidate", { candidate });
    });
});

connectDB().then(() => {});
server.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
