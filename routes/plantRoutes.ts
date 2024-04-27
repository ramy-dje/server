import { Router } from "express";
import {
  addPlant,
  getPlant,
  getPlantBySeller,
  getPlants,
  likePlant,
  removeReviewPlant,
  updatePlant,
  removePlant,
  addReviewPlant,
  likeReview,
  changeQuantityPlant,
  changePriceOfPlant,
  getSellerPlants,
  updateReview,
  getPlantsByName,
} from "../controllers/plantController";
import { ERole } from "../models/userModel";
import { isAuthorized, isAuthorizedRole } from "../utilite/isAthorazed";

const plantRoute = Router();

plantRoute.get("/plants", getPlants);
plantRoute.get("/plant/:id", getPlant);
plantRoute.get("/plantBySeller", isAuthorized,getPlantBySeller);
plantRoute.get("/plantByName/:name",getPlantsByName);
plantRoute.post("/plant", isAuthorized,isAuthorizedRole(ERole.USER), addPlant);
plantRoute.put("/plant/:id", isAuthorized, updatePlant);
plantRoute.delete("/plant/:id", isAuthorizedRole(ERole.SELLER), removePlant);
plantRoute.put("/like_plant/:id", likePlant);
plantRoute.put("/plant_review/:id", isAuthorized,addReviewPlant);
plantRoute.delete(
  "/plant_review/:id",
  isAuthorizedRole(ERole.SELLER),
  removeReviewPlant
);
plantRoute.put("/like_review_plant/:id", likeReview);
plantRoute.put(
  "/quantity_plant/:id",
  isAuthorizedRole(ERole.SELLER),
  changeQuantityPlant
);
plantRoute.put(
  "/price_plant/:id",
  isAuthorizedRole(ERole.SELLER),
  changePriceOfPlant
);
plantRoute.put("/update_review_plant/:id", updateReview);
plantRoute.get(
  "/seller_plants/",
  isAuthorizedRole(ERole.SELLER),
  getSellerPlants
);

export default plantRoute;
