import dns from "node:dns";
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
  console.log("Could not set custom DNS servers");
}
import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";

// cloudinary import
import cloudinary from "cloudinary";
// cloudinary invoke
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//routes imports

import jobRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js";
import clinicRouter from "./routes/clinicRouter.js";
import healthCareProfessionalRouter from "./routes/healthCareProfessionalRouter.js";
import blogRouter from "./routes/blogRouter.js";
import statusRouter from "./routes/statusRouter.js";
import messageRouter from "./routes/messageRouter.js";
import cvRouter from "./routes/cvRouter.js";
import adminRouter from "./routes/adminRouter.js";
import { seedDemoAccounts } from "./seedDemoAccounts.js";

//middlewares imports

import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import {
  authenticateUser,
  allowGuestForViewing,
  authenticateHealthCareProfessional,
  authorizePermissions,
} from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser";
import { logout } from "./controllers/authController.js";
// dirname public
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import {
  getAllClinics,
  getAllHealthCareProfessionals,
} from "./controllers/clinicController.js";
import { getAllJobsCount } from "./controllers/jobController.js";

import http from "http";
import { Server } from "socket.io";

const app = express();
const port = process.env.PORT || 5100;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow frontends to connect via Websocket
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`[Socket.io] User connected: ${socket.id}`);
  
  socket.on("join_chat", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("send_message", (data) => {
    // Emit to other users in the chat room
    socket.to(data.conversationId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket.io] User disconnected: ${socket.id}`);
  });
});

// Middleware section

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cookieParser());
app.use(express.json());

// app.use(express.urlencoded({ extended: true }));
// static files section
const __dirname = dirname(fileURLToPath(import.meta.url));
// use path .resolve not path.join
// deprecated
// app.use(express.static(path.resolve(__dirname, "../public")));
app.use(express.static(path.resolve(__dirname, "../client/dist")));
// Make sure uploads directory is accessible
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../../public/uploads"))
);

// admin section
app.use("/api/v1/admin", adminRouter);

// Routes section
app.use("/api/v1/jobs", jobRouter); // Remove authenticateUser to allow guest access
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/clinics", authenticateUser, clinicRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/status", statusRouter);

// healthcare professionals API call endpoint
// Public routes are handled separately in the router
app.use("/api/v1/healthcare-professionals", healthCareProfessionalRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/cv", cvRouter);
// Health Check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});
//
app.get("/api/v1/test", (req, res) => {
  res.json("Test route is working!");
});

app.get("/api/v1/auth/logout", authenticateUser, logout);
// Restricted public-listing endpoints: requires at minimum a guest token
// to prevent unauthenticated mass enumeration of all user profiles (SECURITY-01)
app.use("/api/v1/all-clinics", allowGuestForViewing, getAllClinics);
app.use("/api/v1/all-seekers", allowGuestForViewing, getAllHealthCareProfessionals);
app.get("/api/v1/all-jobs", allowGuestForViewing, getAllJobsCount);
//

// Connect to MongoDB with retry logics
const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      console.log(
        "Connecting to MongoDB with URL:",
        process.env.MONGO_URL,
        "..."
      ); // Log connection string
      await mongoose.connect(process.env.MONGO_URL, {
        // useNewUrlParser: true, // Added option
        // useUnifiedTopology: true, // Added option
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        retryWrites: true,
        retryReads: true,
      });
      console.log("Connected to MongoDB successfully!");
      return true;
    } catch (error) {
      retries++;
      console.error(
        `Connection attempt ${retries} failed:`,
        error,
        error.message
      );
      if (retries === MAX_RETRIES) {
        console.error(" Max retries reached. Exiting...");
        return false;
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

//connect

// Start server
const start = async () => {
  try {
    const connected = await connectDB();
    if (connected) {
      try {
        await seedDemoAccounts();
      } catch (seedErr) {
        console.warn("Notice: demo accounts check encountered:", seedErr.message);
      }
      server.listen(port, () => {
        console.log(`Server running on port ${port}...`);
      });
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

start();
//
// SPA fallback: all non-API routes serve the React client
app.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});
// Error handling middleware
app.use(errorHandlerMiddleware);
