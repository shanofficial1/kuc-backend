import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./db/config.mjs";
import authRouter from "./routes/auth.routes.mjs";
import studentProfileRouter from "./routes/studentProfile.routes.mjs";
import requestAccessRouter from "./routes/RequestAccess.routes.mjs";
import searchRouter from "./routes/search.route.mjs";
import userRouter from "./routes/user.router.mjs";
import fileRouter from "./routes/file.routes.mjs";
import { cleanupTemp } from "./utils/cleanupTemp.mjs";
import unlockRequestRouter from "./routes/unlockRequest.routes.mjs";
setInterval(
  cleanupTemp,
  60 * 60 * 1000
);

const app = express()
app.use(cors());
app.use(express.json())

dotenv.config()

connectDB()

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}]`,
    req.method,
    req.originalUrl
  );

  next();
});

app.use("/uploads", express.static("uploads"));
app.use("/api/file", fileRouter);
app.use("/api/auth", authRouter)
app.use("/api/student/", studentProfileRouter)
app.use("/api/privilege/", requestAccessRouter)
app.use("/api/user", userRouter);
app.use("/", searchRouter);
app.use(
  "/api/unlock-request",
  unlockRequestRouter
);



app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(400).json({
    message: err.message || "Something went wrong",
  });
});


const PORT = process.env.PORT || 3002;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
