import mongoose, { Model, Schema, Document } from "mongoose";

export interface IVisitor extends Document {
  ip: string;
  pageView: number;
}

const visitorSchema = new Schema<IVisitor>(
  {
    ip: {
      type: String,
      required: [true, "name of volunteer is required"],
    },
    pageView: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Visitor: Model<IVisitor> = mongoose.model("Visitor", visitorSchema);
export default Visitor;