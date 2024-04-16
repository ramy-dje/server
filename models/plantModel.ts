import mongoose, { Model, Schema, Document, ObjectId } from "mongoose";
import User from "./userModel";

export interface IPlant extends Document {
  name: string;
  description: string;
  owner: ObjectId;
  image: { public_id: string; url: string };
  images: { public_id: string; url: string }[];
  price: number;
  quantity: number;
  reviews: {
    userId: ObjectId;
    review: string;
    likes: string[];
  }[];
  discount: number;
  purschased: string[];
  likes: string[];
}

const plantSchema = new Schema<IPlant>(
  {
    name: {
      type: String,
      required: [true, " The Name of the plant is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, " The Owner of the plant is required"],
    },
    description: String,
    image:{
        public_id: String,
        url: String,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    price: {
      type: Number,
      required: [true, " The Price of the plant is required"],
    },
    quantity: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: [true, "user Id is required"],
        },
        review: {
          type: String,
          required: [true, "review field is required"],
        },
        likes: [String],
      },
    ],
    discount: Number,
    purschased: [String],
    likes: [String],
  },
  {
    timestamps: true,
  }
);

const Plant: Model<IPlant> = mongoose.model("Plant", plantSchema);
export default Plant;
