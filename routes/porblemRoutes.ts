import { Router } from "express";
import {
  getProblems,
  indicatProblem,
  getProblem,
  getProblemByFilter,
  solevProblem,
} from "../controllers/problemController";
import { ERole } from "../models/userModel";
import { isAuthorizedRole } from "../utilite/isAthorazed";
const problemRouter = Router();

problemRouter.post("/problem", indicatProblem);
problemRouter.get("/problems", isAuthorizedRole(ERole.ADMIN), getProblems);
problemRouter.get("/problem/:id", isAuthorizedRole(ERole.ADMIN), getProblem);
problemRouter.get(
  "/problem_filter",
  isAuthorizedRole(ERole.ADMIN),
  getProblemByFilter
);
problemRouter.put("/problem/:id", isAuthorizedRole(ERole.ADMIN), solevProblem);

export default problemRouter;
