import mongoose, { Model, Schema, Document, ObjectId } from "mongoose";

export interface IMessage extends Document {
  senderId: ObjectId;
  receiverId: ObjectId;
  content: string;
}
const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      required: [true, "sender id is required"],
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      required: [true, "reciver id is required"],
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    content: {
      required: [true, "content is required"],
      type: "string",
    },
  },
  {
    timestamps: true,
  }
);

const Message: Model<IMessage> = mongoose.model("Message", messageSchema);
export default Message;
