import mongoose, { Model, Document, Schema, ObjectId } from "mongoose";

export interface IPurchase extends Document {
  purchases: {
    plantId: ObjectId;
    sellerId: ObjectId;
    quantity: number;
    price: number;
  }[];
  clientId: ObjectId;
  date: Date;
}

const purchaseSchema = new Schema<IPurchase>({
  purchases: [
    {
      plantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plant",
        required: [true, " The plant id is required"],
      },
      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, " The Owner of the plant is required"],
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
        required: [true, " The price of the plant is required"],
      },
    },
  ],
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, " The client id is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Purchase: Model<IPurchase> = mongoose.model<IPurchase>(
  "Purchase",
  purchaseSchema
);

export default Purchase;
