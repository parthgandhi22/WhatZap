import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import auth from "./routes/auth.js";  // Exported default
import msg from "./routes/msg.js";    // Exported default
import { connectdb } from "./lib/db.js"; // Exported named, therefore {}
import {app,server} from "./lib/socket.js"

dotenv.config();
const PORT = process.env.PORT;

connectdb().then(() => {
    console.log("Database Connected Successfully");

    app.use(express.json({ limit: "100mb" }));  // Converts the incoming to JSON data // Using axios, therefore required // If using fetch, then not required
    app.use(express.urlencoded({ limit: "100mb", extended: true }));         //limit changed due to payload 
    app.use(cookieParser()); // Used for handling cookies

    app.use(cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true
    }));

    
    app.use("/api/auth", auth);    // If users enter /api/auth, it goes to the auth route
    app.use("/api/message", msg);  // If users enter /api/message, it goes to the msg route

    server.listen(PORT, () => {             
        console.log(` Server is running on port: ${PORT}`);
    });

}).catch((error) => {
    console.error(" Failed to connect to MongoDB:", error);
    process.exit(1);
});
