import { Response, Request } from "express";
import ErrorHandler from "../ErrorHandler";
import Specialiste from "../models/specialisteModel";
import User, { ERole } from "../models/userModel";
import redis from "../utilite/redis";
import cloudinary from "cloudinary";
import Portfolio from "../models/portfolioModel";

require("dotenv").config();

export const getSpeacialists = async (req: Request, res: Response) => {
  try {
    const { limit } = req.body;
    const skipe = (+req.params.id - 1) * limit;
    const specialistes = await Specialiste.find()
      .populate("user", "firstName lastName avatar")
      .skip(skipe)
      .limit(limit);
    if (specialistes.length === 0) {
      throw Error("that's all the specialistes we have");
    }
    res.status(200).json({
      success: true,
      specialistes,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getSpeacialist = async (req: Request, res: Response) => {
  const {id} = req.params
  try {
    const specialiste = await Specialiste.findById(
      id
    ).populate([
      {
        path: "user",
        select: "firstName lastName avatar",
      },
      {
        path: "projects",
        select: "projectName companyName duration",
      },
    ]);
    if (!specialiste) {
      throw Error("this specialistes is not available ");
    }
    res.status(200).json({
      success: true,
      specialiste,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
export const getSpecialistesByName= async (req: Request, res: Response) => {
  try {
    const searchText = req.params.name;
    const specialistes = await Specialiste.find().populate([{
    path:'user',
    select:'firstName lastName avatar'
  }]).then(users =>
    users.filter(({user} : any )=> ( new RegExp(searchText, 'i').test(user.firstName) || new RegExp(searchText, 'i').test(user.lastName)))
  );
    res.status(200).json({ success: true, specialistes });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
export const createSpecialiste = async (req: Request, res: Response) => {
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
      throw Error("You are already a specialiste");
    }
    const specialiste = await Specialiste.create({
      _id: user._id,
      description,
      studies,
      profestionalExp,
      specialite,
    });
    if (!specialiste) {
      throw Error("this specialite is not created");
    }
    user.role = ERole.SPECIALIST;
    await user.save();
    await redis.set(user._id, JSON.stringify(user));
    res.status(200).json({
      success: true,
      specialiste,
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
    const specialiste = await Specialiste.findById((req as any).user._id);
    if (!specialiste) {
      throw Error("this user is not available");
    }
    specialiste.projects.push(portfolio._id);
    await specialiste.save();
    res.status(200).json({
      success: true,
      specialiste,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
