import { Response, Request } from "express";
import ErrorHandler from "../ErrorHandler";
import Freelancer, { IFreelancer } from "../models/freelancerModel";
import Specialiste, { ISpecialiste } from "../models/specialisteModel";
import Portfolio, { IPortfolio } from "../models/portfolioModel";
import { ERole } from "../models/userModel";

export const updatePortfolioProject = async (req: Request, res: Response) => {
  try {
    const { projectName, duration, description, companyName } = req.body;
    const portfolio = (await Portfolio.findById(req.params.id)) as IPortfolio;
    if (portfolio.owner != (req as any).user._id) {
      throw new Error("you can't update a portfolio , its not yours");
    }
    if (projectName) {
      portfolio.projectName = projectName;
    }
    if (companyName) {
      portfolio.companyName = companyName;
    }
    if (duration) {
      portfolio.duration = duration;
    }
    if (description) {
      portfolio.description = description;
    }
    await portfolio.save();
    res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const reviewPortfolioProject = async (req: Request, res: Response) => {
  try {
    const { review, rating } = req.body;
    const portfolio = (await Portfolio.findById(req.params.id)) as IPortfolio;
    const isReviewBefore = portfolio.reviews.find(
      (review) => review.userId == (req as any).user._id
    );
    if (isReviewBefore) {
      throw new Error(
        "You reviewed before you cant review this portfolio again"
      );
    }
    portfolio.reviews.push({
      userId: (req as any).user._id,
      review,
      rating,
    });
    await portfolio.save();
    res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getPortfolioProjects = async (req: Request, res: Response) => {
  try {
    const { limit } = req.body;
    const skipe = (+req.params.id - 1) * limit;
    const portfolios = (await Portfolio.find()
      .skip(skipe)
      .limit(limit)) as IPortfolio[];
    if (portfolios.length === 0) {
      throw new Error("that's all the portfolios we have");
    }
    res.status(200).json({
      success: true,
      portfolios,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getPortfolioProject = async (req: Request, res: Response) => {
  try {
    const portfolio = (await Portfolio.findById(req.params.id).populate([
      {
        path: "owner",
        select: "firstName lastname avatar",
      },
      {
        path: "reviews.userId",
        select: "firstName lastname avatar",
      },
    ])) as IPortfolio;
    if (!portfolio) {
      throw new Error("this portfolio is not available ");
    }
    res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getPortfoliosForOwner = async (req: Request, res: Response) => {
  try {
    const { limit } = req.body;
    const skip = (+req.params.id - 1) * limit;
    const portfolios = (await Portfolio.find({
      owner: (req as any).user._id,
    })
      .skip(skip)
      .limit(limit)) as IPortfolio[];
    if (portfolios.length === 0) {
      throw new Error("that's all the portfolios we have");
    }
    res.status(200).json({
      success: true,
      portfolios,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const deletePortfolioProject = async (req: Request, res: Response) => {
  try {
    const portfolio = (await Portfolio.findById(req.params.id).populate(
      "owner",
      "role"
    )) as IPortfolio;
    if (!portfolio) {
      throw new Error("portfolio in not found");
    }
    if ((portfolio.owner as any)._id != (req as any).user._id) {
      throw new Error("you can't delete this portfolio , its not yours");
    }
    let user;
    if ((portfolio.owner as any).role == ERole.FREELANCER) {
      user = (await Freelancer.findById(
        (portfolio.owner as any)._id
      )) as IFreelancer;
    } else {
      user = (await Specialiste.findById(
        (portfolio.owner as any)._id
      )) as ISpecialiste;
    }
    const index = user.projects.findIndex(
      (id) => id.toString() == portfolio._id.toString()
    ) as number;
    if (index === -1) {
      throw new Error("We dont get the portfolio in the project of the owner");
    } else {
      user?.projects.splice(index, 1);
      await user?.save();
    }
    await portfolio.deleteOne();
    res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
