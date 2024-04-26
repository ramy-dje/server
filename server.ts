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
import http from 'http';


require("dotenv").config();

const app = express();

export const server = http.createServer(app);

cloudinary.config({
  cloud_name: process.env.CLOUDE_NAME,
  api_key: process.env.CLOUD_API_NAME,
  api_secret: process.env.CLOUDE_KEY,
});

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);
app.use(cookieParser());

const connectionDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`).then(() => {
      console.log("Connected to Mongo");
    });
    server.listen(process.env.PORT, () => console.log(`${process.env.PORT}`));
  } catch (err) {
    console.log(err);
    setTimeout(() => connectionDB(), 5000);
  }
};

connectionDB();




app.use(authRouter);
//app.use(refreshAccessToken);
//app.use(isAuthorized);
app.use(plantRoute);
app.use(purchaseRouter);
app.use(articleRouter);
app.use(problemRouter);
app.use(projectRouter);
app.use(messageRouter);
app.use(notificationRouter);
app.use(specialisteRouter);
app.use(freelancerRouter);
app.use(organismeRouter);
app.use(portfolioRouter);
app.use(userRouter);
