import { Router } from "express";
import {
  getProject,
  getProjectByFilter,
  getProjects,
  likeReviewProject,
  makeProject,
  reviewProject,
  removeReviewProjec,
  addTaskToProject,
  startTaskOfProject,
  endTaskOfProject,
  addNoteToTask,
  updateTaskInfo,
} from "../controllers/projectController";

const projectRouter = Router();

projectRouter.post("/project", makeProject);
projectRouter.get("/projects", getProjects);
projectRouter.get("/project/:id", getProject);
projectRouter.get("/project_filter", getProjectByFilter);
projectRouter.put("/review_project/:id", reviewProject);
projectRouter.put("/like_review_project/:id", likeReviewProject);
projectRouter.delete("/remove_review_project/:id", removeReviewProjec);
projectRouter.post("/task/:id", addTaskToProject);
projectRouter.put("/start_task/:id", startTaskOfProject);
projectRouter.put("/end_task/:id", endTaskOfProject);
projectRouter.put("/note_task/:id", addNoteToTask);
projectRouter.put("/task/:id", updateTaskInfo);

export default projectRouter;
