import mongoose, { Model, Schema, Document, ObjectId } from "mongoose";

export interface IProblem extends Document {
  userId: ObjectId;
  problem: string;
  location: string;
  status: string;
  isSolved: boolean;
}

const problemSchema = new Schema<IProblem>(
  {
    userId: {
      required: [true, "user id is required"],
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    problem: {
      required: [true, "problem is required"],
      type: String,
    },
    location: String,
    status: {
      type: String,
      default: "unread",
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Problem: Model<IProblem> = mongoose.model("Problem", problemSchema);
export default Problem;
