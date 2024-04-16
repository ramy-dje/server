import { Router } from "express";
import {
  addUserContact,
  getContacts,
  updateUserAvatar,
  updateUserInfo,
} from "../controllers/userController";
import { isAuthorized } from "../utilite/isAthorazed";

const userRouter = Router();

userRouter.put("/user_information", isAuthorized,updateUserInfo);
userRouter.put("/user_avatar", isAuthorized , updateUserAvatar);
userRouter.put("/add_user_contact", isAuthorized , addUserContact);
userRouter.get("/getContacts",isAuthorized,getContacts);


export default userRouter;
