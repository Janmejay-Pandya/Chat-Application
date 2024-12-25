import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import messageRoute from "./src/routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./src/lib/socket.js";
import path from "path"


dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend's URL
    credentials: true,
}));
app.use(cookieParser());
// app.use(express.json());
app.use(express.json({ limit: '10mb' })); // Increase the limit to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // For URL-encoded data

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log("server is running at PORT:" + PORT); 
    connectDB();
});