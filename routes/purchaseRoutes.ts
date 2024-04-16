import { Router } from "express";
import {
  createPurchase,
  getPurchases,
  getClientPurchases,
  getSellerPurchaes,
} from "../controllers/purchaseController";
import { ERole } from "../models/userModel";
import { isAuthorized, isAuthorizedRole } from "../utilite/isAthorazed";

const purchaseRouter = Router();

purchaseRouter.post("/purchase",isAuthorized,createPurchase);
purchaseRouter.get("/purchases", isAuthorizedRole(ERole.ADMIN), getPurchases);
purchaseRouter.get("/purchase",isAuthorized,getClientPurchases);
purchaseRouter.get(
  "/purchase_seller",
  isAuthorizedRole(ERole.SELLER),
  getSellerPurchaes
);

export default purchaseRouter;
