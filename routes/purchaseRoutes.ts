import { Router } from "express";
import {
  createPurchase,
  getPurchases,
  getClientPurchases,
  getSellerPurchaes,
  confirmePurchaes,
  deletePurchaes
} from "../controllers/purchaseController";
import { ERole } from "../models/userModel";
import { isAuthorized, isAuthorizedRole } from "../utilite/isAthorazed";

const purchaseRouter = Router();

purchaseRouter.post("/purchase",isAuthorized,createPurchase);
purchaseRouter.get("/purchases", isAuthorizedRole(ERole.ADMIN), getPurchases);
purchaseRouter.get("/purchase",isAuthorized,getClientPurchases);
purchaseRouter.put("/confirmPurchase",confirmePurchaes);
purchaseRouter.get(
  "/purchase_seller",
  isAuthorized,
  getSellerPurchaes
);
purchaseRouter.put(
  "/purchase_delete",
  deletePurchaes
);
export default purchaseRouter;
