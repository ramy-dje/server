import { Router } from "express";
import {
  getSpeacialists,
  getSpeacialist,
  createSpecialiste,
  addProjectToPortfolio,
  getSpecialistesByName,
} from "../controllers/specialisteController";
import { ERole } from "../models/userModel";
import { isAuthorizedRole } from "../utilite/isAthorazed";

const specialisteRouter = Router();

specialisteRouter.get("/specialistes", getSpeacialists);
specialisteRouter.get("/specialiste/:id", getSpeacialist);
specialisteRouter.get("/specialistesByName/:name", getSpecialistesByName);
specialisteRouter.post("/specialiste", createSpecialiste);
specialisteRouter.put(
  "/specialiste",
  isAuthorizedRole(ERole.SPECIALIST),
  addProjectToPortfolio
);

export default specialisteRouter;
