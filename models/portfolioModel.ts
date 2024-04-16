import mongoose, { Model, Schema, Document, ObjectId } from "mongoose";

export enum EPortfolioStars {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export interface IPortfolio extends Document {
  projectName: string;
  duration: String;
  position: String;
  description: String;
  companyName: string;
  images: { public_id: string; url: string }[];
  reviews: {
    userId: ObjectId;
    review: string;
    rating: Number;
  }[];
  owner: ObjectId;
}

export const portfolioSchema = new Schema<IPortfolio>(
  {
    projectName: {
      type: String,
      required: true,
    },
    duration: String,
    position: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    companyName: String,
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    reviews: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: [true, "user id is required"],
          unique: true,
        },
        review: {
          type: String,
          required: [true, "review is required"],
        },
        rating: {
          type: Number,
          enum: [1, 2, 3, 4, 5],
          required: true,
        },
      },
    ],
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "owner of the portfolio is required"],
    },
  },
  { timestamps: true }
);

const Portfolio: Model<IPortfolio> = mongoose.model<IPortfolio>(
  "Portfolio",
  portfolioSchema
);

export default Portfolio;
