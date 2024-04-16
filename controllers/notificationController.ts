import { Response, Request, NextFunction } from "express";
import { ObjectId } from "mongoose";
import ErrorHandler from "../ErrorHandler";
import Notification, { EStatus } from "../models/notificationModel";
import cron from "node-cron";

export const makeNotifiaction = async (
  destination: ObjectId,
  content: string
) => {
  const notification = await Notification.create({
    destination,
    content,
  });
  if (!notification) {
    throw new Error("Notification has not been created");
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({
      destination: (req as any).user._id,
    });
    res.status(200).send({ success: true, notifications });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getNotification = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, {
      status: EStatus.READ,
    });
    if (!notification) {
      throw new Error("Notification is not available");
    }
    res.status(200).send({ success: true, notification });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

cron.schedule("0 0 * * *", async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    await Notification.deleteMany({
      status: EStatus.READ,
      createdAt: { $lt: thirtyDaysAgo },
    });
  } catch (err) {
    console.error("Error deleting old read notifications:", err);
  }
});
