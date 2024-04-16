import { Response, Request } from "express";
import ErrorHandler from "../ErrorHandler";
import Problem, { IProblem } from "../models/problemModel";

export const indicatProblem = async (req: Request, res: Response) => {
  try {
    const { problem, location } = req.body;
    const newProblem = await Problem.create({
      problem,
      location,
      userId: (req as any).user._id,
    });
    if (!newProblem) {
      throw new Error("Problem does not created");
    }
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getProblems = async (req: Request, res: Response) => {
  try {
    const limit = req.body.limit;
    const problems = await Problem.find()
      .populate("userId", "firstName lastName avatar")
      .select("-location")
      .limit(limit)
      .skip((parseInt(req.params.id) - 1) * parseInt(limit));
    if (problems.length === 0) {
      throw new Error("This is all the problems");
    }
    res.status(200).json({ success: true, problems });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getProblem = async (req: Request, res: Response) => {
  try {
    const problem = (await Problem.findById(req.params.id).populate(
      "userId",
      "firstName lastName avatar"
    )) as IProblem;
    if (!problem) {
      throw new Error("This Problem is not available");
    }
    problem.status = "read";
    await problem.save();
    res.status(200).json({ success: true, problem });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getProblemByFilter = async (req: Request, res: Response) => {
  try {
    const filter = req.body;
    const problem = await Problem.find(filter).populate(
      "userId",
      "firstName lastName avatar"
    );
    res.status(200).json({ success: true, problem });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const solevProblem = async (req: Request, res: Response) => {
  try {
    console.log("solved");
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      {
        isSolved: true,
      },
      { new: true }
    );
    res.status(200).json({ success: true, problem });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
