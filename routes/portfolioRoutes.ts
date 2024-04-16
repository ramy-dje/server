import { Router } from "express";
import {
  updatePortfolioProject,
  reviewPortfolioProject,
  deletePortfolioProject,
  getPortfolioProjects,
  getPortfolioProject,
  getPortfoliosForOwner,
} from "../controllers/portfolioController";

const portfolioRouter = Router();

portfolioRouter.put("/update_portfolio/:id", updatePortfolioProject);
portfolioRouter.delete("/delete_portfolio/:id", deletePortfolioProject);
portfolioRouter.put("/review_portfolio/:id", reviewPortfolioProject);
portfolioRouter.get("/portfolios/:id", getPortfolioProjects);
portfolioRouter.get("/portfolio/:id", getPortfolioProject);
portfolioRouter.get("/owner_portfolios/:id", getPortfoliosForOwner);

export default portfolioRouter;
