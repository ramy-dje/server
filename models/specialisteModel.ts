import mongoose, { Model, Schema, Document, ObjectId } from "mongoose";
import { IPortfolio, portfolioSchema } from "./portfolioModel";

enum ESpecialite {
  SP1 = "specialite1",
  SP2 = "specialite2",
  SP3 = "specialite3",
  SP4 = "specialite4",
}

export interface ISpecialiste extends Document {
  user: ObjectId;
  description: string;
  studies: string[];
  profestionalExp: string;
  projects: ObjectId[];
  specialite: ESpecialite;
}

const specialisteSchema = new Schema<ISpecialiste>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  studies: [String],
  profestionalExp: String,
  projects: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Portfolio",
      required: [true, "id of protfolio is required"],
    },
  ],
  specialite: {
    type: String,
    enum: Object.values(ESpecialite),
  },
});

const Specialiste: Model<ISpecialiste> = mongoose.model<ISpecialiste>(
  "Specialiste",
  specialisteSchema
);

export default Specialiste;
