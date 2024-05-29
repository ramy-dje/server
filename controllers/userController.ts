import { Response, Request } from "express";
import ErrorHandler from "../ErrorHandler";
import User, { ERole, IUser } from "../models/userModel";
import cloudinary from "cloudinary";
import ensureHttps from "../utilite/https";
import Visitor from '../models/visitorsModel'
import Purchase from "../models/purchaseModel";
import Plant from "../models/plantModel";
import { generateLast6MonthsData } from "../utilite/analytics";
require("dotenv").config();

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, birthday, location,phoneNumber,email,password } =
      req.body as IUser;
    const user = (await User.findById((req as any).user._id)) as IUser;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (birthday) user.birthday = birthday;
    if (location) user.location = location;
    if (email) user.email = email;
    console.log(email);
    await user.save().catch((err) => {
      throw new Error(err);
    });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body as IUser;
    if (!avatar) throw new Error("you must provide an avatar");
    const user = (await User.findById((req as any).user._id)) as IUser;
    /*if (user.avatar.public_id)
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);*/
    const myCloud = await cloudinary.v2.uploader.upload(avatar.toString(), {
      folder: "avatars",
      width: 150,
    });
    user.avatar.public_id = myCloud.public_id;
    user.avatar.url = ensureHttps(myCloud.url);
    await user.save();
    console.log('image')
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
export const addUserContact = async (req: Request, res: Response) => {
  try {
    const { idSpecialist } = req.body;
    if (!idSpecialist) throw new Error("you must provide an id of the contact");
    const user = (await User.findById((req as any).user._id)) as IUser;
    console.log(user)
    user.contacts.push(idSpecialist) 
    await user.save();
    console.log('contacts added')
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export async function removeUserContact(req: Request, res: Response){ // Get user ID from request parameters
  const { contactId } = req.body;
  try {
    const user = await User.findById((req as any).user._id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const updatedContacts = user.contacts.filter((contact) => contact !== contactId);
    user.contacts = updatedContacts; 
    await user.save(); 
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}
export async function getContacts(req: Request, res: Response){ 
  
  try {
    const user = await User.findById((req as any).user._id).populate({
      path:'contacts',
      select: "_id firstName lastName avatar"
    });
    if (!user) {
      return res.status(404).send('User not found');
    }
    const {contacts} = user;
    res.status(200).json({success:true ,contacts});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}
export async function getUserById(req: Request, res: Response){ 
  
  try {
    const {id} = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json({success:true ,user});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}

export const getAdminInfoPurchases = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const totaleSellers = await User.countDocuments({ role: ERole.ADMIN });
    const totaleUsers = await User.countDocuments();
    const totaleVisitor = await Visitor.countDocuments();
    const totaleSales = await Purchase.countDocuments();
    const totalePlants = await Plant.countDocuments();
    const analyticsUsers = await generateLast6MonthsData(Purchase);
    const visitorAnalytics = await generateLast6MonthsData(Purchase);
    const users = await User.find();
    const purchases = await Purchase.find().populate([
      {
        path: "purchases.sellerId",
        select: "firstName lastName avatar",
      },
      {
        path: "clientId",
        select: "firstName lastName avatar",
      },
      {
        path: "purchases.plantId",
        select: "name images",
      },
    ]);
    res.status(200).json({
      success: true,
      user,
      totalePlants,
      totaleSellers,
      totaleSales,
      analyticsUsers,
      purchases,
      users,
      totaleUsers,
      totaleVisitor,
      visitorAnalytics,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};




