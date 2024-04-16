import { Response, Request } from "express";
import ErrorHandler from "../ErrorHandler";
import User, { ERole } from "../models/userModel";
import redis from "../utilite/redis";
import cloudinary from "cloudinary";
import Portfolio from "../models/portfolioModel";
import Freelancer from "../models/freelancerModel";

require("dotenv").config();

export const getFreelancers = async (req: Request, res: Response) => {
  try {
    const { limit } = req.body;
    const skipe = (+req.params.id - 1) * limit;
    const freelancers = await Freelancer.find()
      .populate("_id", "firstName lastName avatar")
      .skip(skipe)
      .limit(limit);
    if (freelancers.length === 0) {
      throw Error("that's all the specialistes we have");
    }
    res.status(200).json({
      success: true,
      freelancers,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getFreelancer = async (req: Request, res: Response) => {
  try {
    const freelancer = await Freelancer.findById(
      (req as any).user._id
    ).populate([
      {
        path: "_id",
        select: "firstName lastName avatar",
      },
      {
        path: "projects",
        select: "projectName companyName duration",
      },
    ]);
    if (!freelancer) {
      throw Error("this specialistes is not available ");
    }
    res.status(200).json({
      success: true,
      freelancer,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const createFreelancer = async (req: Request, res: Response) => {
  try {
    const { description, studies, profestionalExp, specialite } = req.body;
    if (!description || !studies || !profestionalExp || !specialite) {
      throw new Error("all the fields must be");
    }
    const user = await User.findById((req as any).user._id);
    if (!user) {
      throw Error("this user is not available");
    }
    if (user.role !== ERole.USER) {
      throw Error("You can't be an freelancer");
    }
    const freelancer = await Freelancer.create({
      _id: user._id,
      description,
      studies,
      profestionalExp,
      specialite,
    });
    if (!freelancer) {
      throw Error("this specialite is not created");
    }
    user.role = ERole.FREELANCER;
    await user.save();
    await redis.set(user._id, JSON.stringify(user));
    res.status(200).json({
      success: true,
      freelancer,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const addProjectToPortfolio = async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      companyName,
      position,
      duration,
      description,
      images,
      reviews,
    } = req.body;
    if (!projectName || !description || !companyName || !duration) {
      throw new Error("all the fields must be");
    }
    const imagesUrls: { public_id: string; url: string }[] = [];
    if (images?.length > 0) {
      images.forEach(async (i: string) => {
        const myCloud = await cloudinary.v2.uploader.upload(i, {
          folder: "portfolioImages",
          width: 150,
        });
        imagesUrls.push({
          public_id: myCloud.public_id,
          url: myCloud.url,
        });
      });
    }
    const portfolio = await Portfolio.create({
      projectName,
      companyName,
      position,
      duration,
      description,
      images: imagesUrls,
      reviews,
      owner: (req as any).user._id,
    });
    if (!portfolio) {
      throw new Error("portfolio does not created properly");
    }
    const freelancer = await Freelancer.findById((req as any).user._id);
    if (!freelancer) {
      throw Error("this user is not available");
    }
    freelancer.projects.push(portfolio._id);
    await freelancer.save();
    res.status(200).json({
      success: true,
      freelancer,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
