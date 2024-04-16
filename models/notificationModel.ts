import mongoose, { Model, Schema, Document, ObjectId } from "mongoose";

export enum EStatus {
  READ = "read",
  UNREAD = "unread",
}

export interface INotification extends Document {
  destination: ObjectId;
  content: string;
  status: EStatus;
}

const notificationSchema = new Schema<INotification>(
  {
    destination: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    content: {
      required: [true, "content is required"],
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(EStatus),
      default: EStatus.UNREAD,
    },
  },
  {
    timestamps: true,
  }
);

const Notification: Model<INotification> = mongoose.model(
  "Notification",
  notificationSchema
);
export default Notification;
