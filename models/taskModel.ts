import mongoose, { Model, Schema, Document, ObjectId } from "mongoose";

export interface ITask extends Document {
  name: string;
  estimatedDuration: string;
  dateToEnd: Date;
  dateToStart: Date;
  worker: ObjectId;
  notes: string[];
}

const taskSchema = new Schema<ITask>({
  name: {
    type: String,
    required: [true, "the name of the task is required"],
  },
  estimatedDuration: String,
  dateToStart: Date,
  dateToEnd: Date,
  worker: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "the worker is required"],
  },
  notes: [String],
});

const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);

export default Task;
