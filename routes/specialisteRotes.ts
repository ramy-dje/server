import { Router } from "express";
import {
  getSpeacialists,
  getSpeacialist,
  createSpecialiste,
  addProjectToPortfolio,
} from "../controllers/specialisteController";
import { ERole } from "../models/userModel";
import { isAuthorizedRole } from "../utilite/isAthorazed";

const specialisteRouter = Router();

specialisteRouter.get("/specialistes", getSpeacialists);
specialisteRouter.get("/specialiste/:id", getSpeacialist);
specialisteRouter.post("/specialiste", createSpecialiste);
specialisteRouter.put(
  "/specialiste",
  isAuthorizedRole(ERole.SPECIALIST),
  addProjectToPortfolio
);

export default specialisteRouter;
