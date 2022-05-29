import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";

import AppError from "./utils/AppError";
import GlobalErrorHandler from "./controllers/errorController";

import authRouter from "./routes/authRoutes";
import blogRouter from "./routes/blogRoutes";
import userRouter from "./routes/userRoutes";
import seedRouter from "./routes/seedRoutes";
import viewRouter from "./routes/viewRoutes";

// SETTING UP ENV PATH
dotenv.config();

const app: express.Application = express();

// SERVER STATIC FILES
app.use(express.static("public"));

// SETTING UP SERVER-SIDE RENDER ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// DEVELOPMENT LOGGER
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// CORS
app.use(cors());

// BODY PARSER
app.use(express.json());

// VIEWS ROUTES
app.use("/", viewRouter);

// API ROUTES
const _base_url: string = "/api";

app.use(`${_base_url}`, authRouter);
app.use(`${_base_url}/blogs`, blogRouter);
app.use(`${_base_url}/seed`, seedRouter);
app.use(`${_base_url}/users`, userRouter);

// INVALID ROUTE HANLDER
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

// GLOBAL OPERATIONAL ERROR HANDLER
app.use(GlobalErrorHandler);

export default app;
