import { Router } from "express";
import {
  deleteMessage,
  getConversation,
  sendMessage,
} from "../controllers/messageController";
import { isAuthorized } from "../utilite/isAthorazed";

const messageRouter = Router();

messageRouter.get("/conversation/:receiverId",isAuthorized, getConversation);
messageRouter.post("/message",isAuthorized,sendMessage);
messageRouter.delete("/message/:id", deleteMessage);

export default messageRouter;
