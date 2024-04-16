import mongoose, { Model, Schema, Document } from "mongoose";

export interface IVolunteer extends Document {
  name: string;
  description: string;
}

const volunteerSchema = new Schema<IVolunteer>({
  name: {
    type: String,
    required: [true, "name of volunteer is required"],
  },
  description: {
    type: String,
    required: [true, "description of volunteer is required"],
  },
});

const Volunteer: Model<IVolunteer> = mongoose.model(
  "Volunteer",
  volunteerSchema
);
export default Volunteer;
