import mongoose, { Model, Schema, Document, ObjectId } from "mongoose";

enum ESpecialiteFr {
  SP1 = "specialite1",
  SP2 = "specialite2",
  SP3 = "specialite3",
  SP4 = "specialite4",
}

export interface IFreelancer extends Document {
  user: ObjectId;
  description: string;
  studies: string[];
  profestionalExp: string;
  projects: ObjectId[];
  specialite: ESpecialiteFr;
}

const freelancerSchema = new Schema<IFreelancer>({
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
    enum: Object.values(ESpecialiteFr),
  },
});

const Freelancer: Model<IFreelancer> = mongoose.model<IFreelancer>(
  "Freelancer",
  freelancerSchema
);

export default Freelancer;
