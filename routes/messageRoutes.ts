import { Router } from "express";
import {
  deleteMessage,
  getConversation,
  sendMessage,
} from "../controllers/messageController";

const messageRouter = Router();

messageRouter.get("/conversation/:id", getConversation);
messageRouter.post("/message", sendMessage);
messageRouter.delete("/message/:id", deleteMessage);

export default messageRouter;
