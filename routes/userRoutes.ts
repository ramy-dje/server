import { Router } from "express";
import {
  addUserContact,
  getAdminInfoPurchases,
  getContacts,
  getUserById,
  updateUserAvatar,
  updateUserInfo,
} from "../controllers/userController";
import { isAuthorized, isAuthorizedRole } from "../utilite/isAthorazed";
import { ERole } from "../models/userModel";

const userRouter = Router();

userRouter.put("/user_information", isAuthorized,updateUserInfo);
userRouter.put("/user_avatar", isAuthorized , updateUserAvatar);
userRouter.put("/add_user_contact", isAuthorized , addUserContact);
userRouter.get("/getContacts",isAuthorized,getContacts);
userRouter.get("getUser/:id",getUserById);
userRouter.get(
  "/admin-purchases",
  isAuthorizedRole(ERole.ADMIN),
  getAdminInfoPurchases
);



export default userRouter;
