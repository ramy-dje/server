import { Response, Request } from "express";
import ErrorHandler from "../ErrorHandler";
import Message from "../models/messageModel";

export const getConversation = async (req: Request, res: Response) => {
  try {
    const { receiverId } = req.params;
    const senderId = (req as any).user._id;
    if (!senderId || !receiverId) {
      throw new Error("You dont give me the sender id or receiver id");
    }
    //const limit = 20;
   // const skip = (parseInt(req.params.id) - 1) * limit;
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      //.sort({ createdAt: -1 })
      /*.skip(skip)
      .limit(limit);*/
    if (messages.length === 0) {
      throw new Error("thats all the messages");
    }
    res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, content } = req.body;
    const message = await Message.create({
      senderId: (req as any).user._id,
      receiverId,
      content,
    });
    if (!message) {
      throw new Error("this message is not sending");
    }
    res.status(200).json({
      success: true,
      message,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      throw new Error("this message is not available");
    }
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
