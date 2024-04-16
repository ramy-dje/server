import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import plantRoute from "./routes/plantRoutes";
import authRouter from "./routes/authRoutes";
import articleRouter from "./routes/articleRoutes";
import { isAuthorized, refreshAccessToken } from "./utilite/isAthorazed";
import purchaseRouter from "./routes/purchaseRoutes";
import problemRouter from "./routes/porblemRoutes";
import projectRouter from "./routes/projectRoutes";
import messageRouter from "./routes/messageRoutes";
import notificationRouter from "./routes/notificationRoutes";
import specialisteRouter from "./routes/specialisteRotes";
import freelancerRouter from "./routes/freelancerRoutes";
import organismeRouter from "./routes/organismeRoutes";
import { v2 as cloudinary } from "cloudinary";
import portfolioRouter from "./routes/portfolioRoutes";
import userRouter from "./routes/userRoutes";

require("dotenv").config();

const server = express();

cloudinary.config({
  cloud_name: process.env.CLOUDE_NAME,
  api_key: process.env.CLOUD_API_NAME,
  api_secret: process.env.CLOUDE_KEY,
});

server.use(express.json({ limit: "50mb" }));
server.use(
  cors({
    origin: process.env.ORIGIN,
  })
);
server.use(cookieParser());

const connectionDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`).then(() => {
      server.listen(process.env.PORT, () => console.log(`${process.env.PORT}`));
      console.log("Connected to Mongo");
    });
  } catch (err) {
    console.log(err);
    setTimeout(() => connectionDB(), 5000);
  }
};

connectionDB();
server.use(authRouter);
//server.use(refreshAccessToken);
//server.use(isAuthorized);
server.use(plantRoute);
server.use(purchaseRouter);
server.use(articleRouter);
server.use(problemRouter);
server.use(projectRouter);
server.use(messageRouter);
server.use(notificationRouter);
server.use(specialisteRouter);
server.use(freelancerRouter);
server.use(organismeRouter);
server.use(portfolioRouter);
server.use(userRouter);
