import { Router } from "express";
import { getNotifications } from "../controllers/notificationController";
import { isAuthorized } from "../utilite/isAthorazed";

const notificationRouter = Router();

notificationRouter.get("/notifications",isAuthorized, getNotifications);
notificationRouter.get("/notification/:id", getNotifications);

export default notificationRouter;
