import { Router } from "express";
import {
  getFreelancer,
  getFreelancers,
  createFreelancer,
  addProjectToPortfolio,
} from "../controllers/freelancerController";
import { ERole } from "../models/userModel";
import { isAuthorizedRole } from "../utilite/isAthorazed";

const freelancerRouter = Router();

freelancerRouter.get("/freelancers", getFreelancers);
freelancerRouter.get("/freelancer/:id", getFreelancer);
freelancerRouter.post("/freelancer", createFreelancer);
freelancerRouter.put(
  "/freelancer",
  isAuthorizedRole(ERole.FREELANCER),
  addProjectToPortfolio
);

export default freelancerRouter;
