import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
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
import Visitor from "./models/visitorsModel";

cloudinary.config({
  cloud_name: process.env.CLOUDE_NAME,
  api_key: process.env.CLOUD_API_NAME,
  api_secret: process.env.CLOUDE_KEY,
});


require("dotenv").config();

const app = express();

export const server = http.createServer(app);



app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: '*',
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
    setTimeout(() => connectionDB(), 8000);
  }
};

connectionDB();

app.get('/',(reqq,res)=>{return res.json('hilllp')})


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

app.use(async (req: Request, res: Response, next: NextFunction) => {
  const visitor = await Visitor.findOne({ ip: req.ip });
  if (visitor) {
    visitor.pageView += 1;
    await visitor.save();
  } else {
    await Visitor.create({ ip: req.ip });
  }
  next();
});
