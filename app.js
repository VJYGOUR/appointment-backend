import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import appointmentRoute from "./routes/appointment.route.js";
import slotsRoute from "./routes/slots.route.js";
import authRoute from "./routes/auth.route.js";
import profileRoute from "./routes/profile.route.js";
import connectDB from "./utils/db.js";

const app = express();
app.set("trust proxy", 1);
const PORT = 5000;
dotenv.config();
connectDB();
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://appointment-frontend-dpiw.onrender.com"] // Production: Whitelist your frontend URL
      : ["http://localhost:5173", "http://127.0.0.1:5173"], // Development: Allow localhost
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies/auth headers
  optionsSuccessStatus: 204,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
console.log("Loading authRoute...");
app.use("/api/auth", authRoute);

console.log("Loading appointmentRoute...");
app.use("/api/appointment", appointmentRoute);

console.log("Loading slotsRoute...");
app.use("/api/slots", slotsRoute);
app.use("/api/profile", profileRoute);

// ROUTE
app.get("/", (req, res) => {
  res.json("server is running");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
