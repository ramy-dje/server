import mongoose, { Model, Schema, Document } from "mongoose";

export interface IPlan extends Document {
  name: string;
  description: string;
  images: { publicId: string; url: string }[];
  video: {
    publicId: string;
    url: string;
  };
  price: number;
  duration: number;
}

const planSchema = new Schema<IPlan>({
  name: {
    type: String,
    required: [true, "name of plan is required"],
  },
  description: {
    type: String,
    required: [true, "description of plan is required"],
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
  video: {
    publicId: {
      required: [true, "id of image is required"],
      type: String,
    },
    url: {
      required: [true, "url is required"],
      type: String,
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  duration: Number,
});

const Plan: Model<IPlan> = mongoose.model("Plan", planSchema);
export default Plan;
