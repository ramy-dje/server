import mongoose, { Model, Schema, Document, ObjectId } from "mongoose";

export interface IOrganisme extends Document {
  name: string;
  position: string;
  avatar: {
    public_id: string;
    url: string;
  };
  followers: ObjectId[];
  admins: ObjectId[];
}

const organismeSchema = new Schema<IOrganisme>({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  position: String,
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  followers: {
    type: [mongoose.Types.ObjectId],
    ref: "User",
    required: [true, "folowers is required"],
  },
  admins: {
    type: [mongoose.Types.ObjectId],
    ref: "User",
    required: [true, "folowers is required"],
  },
});

const Organisme: Model<IOrganisme> = mongoose.model(
  "Organisme",
  organismeSchema
);
export default Organisme;
