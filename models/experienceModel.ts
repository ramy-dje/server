import mongoose, { Model, Schema, Document } from "mongoose";

export interface IExperience extends Document {
  projectName: string;
  companyName: string;
  position: string;
  description: string;
  images: { publicId: string; url: string }[];
  reviews: { userId: string; review: string };
  duration: { from: Date; to: Date };
}

const experienceSchema = new Schema<IExperience>({
  projectName: {
    type: String,
    required: [true, "projectName is required"],
  },
  description: {
    type: String,
    required: [true, "description of experience is required"],
  },
  images: [
    {
      publicId: {
        required: [true, "id of image is required"],
        type: String,
      },
      url: {
        required: [true, "url is required"],
        type: String,
      },
    },
  ],
  reviews: [
    {
      userId: {
        type: String,
        required: [true, "userId is required"],
      },
      review: {
        type: String,
        required: [true, "review is required"],
      },
    },
  ],
  companyName: {
    type: String,
    required: [true, "companyName is required"],
  },
  position: String,
  duration: { from: Date, to: Date },
});

const Experience: Model<IExperience> = mongoose.model(
  "Experience",
  experienceSchema
);
export default Experience;
