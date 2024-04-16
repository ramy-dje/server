import mongoose, { Model, Schema, Document, ObjectId } from "mongoose";

export enum EType {
  PAID = "paid",
  VOLUNTEERING = "volunteering",
}

export interface IProject extends Document {
  adminId: ObjectId;
  name: string;
  description: string;
  budget: number;
  dateToBegin: Date;
  dateToEnd: Date;
  reviews: { userId: ObjectId; review: string; likes: ObjectId[] }[];
  type: EType;
  tasksInProgress: ObjectId[];
  tasksCompleted: ObjectId[];
  tasksNotStarted: ObjectId[];
}

const projectSchema = new Schema<IProject>({
  adminId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "admin Id is required"],
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
  description: {
    type: String,
    required: [true, "desciption is required"],
  },
  budget: Number,
  dateToBegin: {
    type: Date,
    required: [true, "the time to begin the project is required"],
  },
  dateToEnd: Date,
  reviews: [
    {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"],
      },
      review: {
        type: String,
        required: [true, "review is required"],
      },
      likes: [mongoose.Types.ObjectId],
    },
  ],
  type: {
    type: String,
    enum: Object.values(EType),
    required: [true, "type is required"],
  },
  tasksCompleted: {
    type: [mongoose.Types.ObjectId],
    ref: "Task",
  },
  tasksInProgress: {
    type: [mongoose.Types.ObjectId],
    ref: "Task",
  },
  tasksNotStarted: {
    type: [mongoose.Types.ObjectId],
    ref: "Task",
  },
});

const Project: Model<IProject> = mongoose.model("Project", projectSchema);
export default Project;
