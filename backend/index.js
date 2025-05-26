import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import orderRoute from "./routes/order.route.js";
import adminRoute from "./routes/admin.route.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

// Normalize origins by removing trailing slash
const allowedOrigins = [
  process.env.FRONTEND_URL_DEV?.replace(/\/$/, ""),
  process.env.FRONTEND_URL_PROD?.replace(/\/$/, ""),
];

console.log("✅ Allowed Origins:", allowedOrigins);

// Debug: Log incoming origin for troubleshooting CORS
app.use((req, res, next) => {
  console.log("🛰️ Incoming request origin:", req.headers.origin);
  next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// CORS Middleware with improved origin handling
app.use(
  cors({
    origin: function (origin, callback) {
      // For non-browser requests like Postman or server-to-server calls
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, origin);
      } else {
        console.error("❌ CORS BLOCKED Origin:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// Routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);

// CORS Error Handler (Optional but useful)
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS error: Origin not allowed" });
  }
  next(err);
});

// DB + Server Boot
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
