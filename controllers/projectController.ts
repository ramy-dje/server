import { Response, Request } from "express";
import { ObjectId } from "mongoose";
import ErrorHandler from "../ErrorHandler";
import Project, { IProject } from "../models/projectModel";
import Task, { ITask } from "../models/taskModel";

export const makeProject = async (req: Request, res: Response) => {
  try {
    const { name, description, dateToBegin, dateToEnd, budget, type } =
      req.body;
    const project = await Project.create({
      adminId: (req as any).user._id,
      name,
      description,
      dateToBegin,
      dateToEnd,
      budget,
      type,
    });
    if (!project) {
      throw new Error("We have Problem ,  the Project does not created");
    }
    res.status(200).json({ success: true, project });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const limit = req.body.limit;
    const projects = await Project.find()
      .populate([
        {
          path: "adminId",
          select: "firstName lastName avatar",
        },
        {
          path: "reviews.userId",
          select: "firstName lastName avatar",
        },
      ])
      .limit(limit)
      .skip((parseInt(req.params.id) - 1) * parseInt(limit));
    res.status(200).json({ success: true, projects });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id).populate([
      {
        path: "adminId",
        select: "firstName lastName avatar",
      },
      {
        path: "reviews.userId",
        select: "firstName lastName avatar",
      },
      {
        path: "tasksInProgress",
        select: "name estimatedDuration dateToEnd dateToStart notes",
        populate: {
          path: "worker",
          select: "firstName lastName avatar",
        },
      },
      {
        path: "tasksCompleted",
        select: "name estimatedDuration dateToEnd dateToStart notes",
        populate: {
          path: "worker",
          select: "firstName lastName avatar",
        },
      },
      {
        path: "tasksNotStarted",
        select: "name estimatedDuration dateToEnd dateToStart notes",
        populate: {
          path: "worker",
          select: "firstName lastName avatar",
        },
      },
    ]);
    res.status(200).json({ success: true, project });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getProjectByFilter = async (req: Request, res: Response) => {
  try {
    const filter = req.body;
    const projects = await Project.find(filter).populate([
      {
        path: "adminId",
        select: "firstName lastName avatar",
      },
      {
        path: "reviews.userId",
        select: "firstName lastName avatar",
      },
    ]);
    res.status(200).json({ success: true, projects });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const reviewProject = async (req: Request, res: Response) => {
  try {
    const { review } = req.body;
    const project = (await Project.findById(req.params.id)) as IProject;
    const index = project.reviews.findIndex(
      (rev) => (rev as any).userId == (req as any).user._id
    );
    if (index !== -1) {
      throw new Error("you have already reviewed this project");
    }
    project.reviews.push({
      review,
      userId: (req as any).user._id,
      likes: [],
    });
    await project.save();
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const likeReviewProject = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.body;
    const project = (await Project.findById(req.params.id)) as IProject;
    const review = project.reviews.find((rev) => (rev as any)._id == reviewId);
    if (!review) {
      throw new Error("review not found");
    }
    const index = (await review?.likes.findIndex(
      (likeId) => likeId == (req as any).user._id
    )) as number;
    if (index === -1) {
      review?.likes.push((req as any).user._id);
    } else {
      review?.likes.splice(index, 1);
    }
    await project.save();
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const removeReviewProjec = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.body;
    const project = (await Project.findById(req.params.id)) as IProject;
    const index = project.reviews.findIndex(
      (rev) => (rev as any)._id == reviewId
    );
    if (index === -1) {
      throw new Error("this review is not available");
    }
    project.reviews.splice(index, 1);
    await project.save();
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const addTaskToProject = async (req: Request, res: Response) => {
  try {
    const { name, estimatedDuration, dateToStart, dateToEnd, notes, worker } =
      req.body;
    const project = (await Project.findById(req.params.id)) as IProject;
    if (!project) {
      throw new Error("this project is not available");
    }
    if (project.adminId != (req as any).user._id) {
      throw new Error(
        "You cant add a task in this project , you are not allowed to"
      );
    }
    const task = await Task.create({
      name,
      estimatedDuration,
      dateToStart,
      notes,
      dateToEnd,
      worker,
    });
    if (!task) {
      throw new Error("task is not created");
    }
    project.tasksNotStarted.push(task._id);
    await project.save();
    res.status(200).json({
      success: true,
      project,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const startTaskOfProject = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.body;
    const project = (await Project.findById(req.params.id)) as IProject;
    if (!project) {
      throw new Error("this project is not available");
    }
    if (project.adminId != (req as any).user._id) {
      throw new Error(
        "You cant add a task in this project , you are not allowed to"
      );
    }
    const index = project.tasksNotStarted.findIndex((id) => id == taskId);
    if (index === -1) {
      throw new Error("task is not available");
    }
    const task = project.tasksNotStarted.splice(index, 1);
    project.tasksInProgress.push(task[0]);
    await project.save();
    res.status(200).json({
      success: true,
      project,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const endTaskOfProject = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.body;
    const project = (await Project.findById(req.params.id)) as IProject;
    if (!project) {
      throw new Error("this project is not available");
    }
    if (project.adminId != (req as any).user._id) {
      throw new Error(
        "You cant add a task in this project , you are not allowed to"
      );
    }
    const index = project.tasksInProgress.findIndex((id) => id == taskId);
    if (index === -1) {
      throw new Error("task is not available");
    }
    const task = project.tasksInProgress.splice(index, 1);
    project.tasksCompleted.push(task[0]);
    await project.save();
    res.status(200).json({
      success: true,
      project,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const addNoteToTask = async (req: Request, res: Response) => {
  try {
    const { note } = req.body;
    const task = (await Task.findById(req.params.id)) as ITask;
    if (!task) {
      throw new Error("this task is not available");
    }
    if (task.worker != (req as any).user._id) {
      throw new Error(
        "You cant add a task in this project , you are not allowed to"
      );
    }
    task.notes.push(note);
    await task.save();
    res.status(200).json({
      success: true,
      task,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updateTaskInfo = async (req: Request, res: Response) => {
  try {
    const updateIndo = req.body;
    const task = (await Task.findById(req.params.id)) as ITask;
    if (!task) {
      throw new Error("this task is not available");
    }
    if (task.worker != (req as any).user._id) {
      throw new Error(
        "You cant add a task in this project , you are not allowed to"
      );
    }
    const newTask = await Task.findByIdAndUpdate(
      req.params.id,
      { ...updateIndo },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      task: newTask,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = (await Task.findById(req.params.id)) as ITask;
    if (!task) {
      throw new Error("this task is not available");
    }
    if (task.worker != (req as any).user._id) {
      throw new Error(
        "You cant add a task in this project , you are not allowed to"
      );
    }
    res.status(200).json({
      success: true,
      task,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
