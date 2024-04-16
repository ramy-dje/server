import mongoose, { Model, Schema, Document } from "mongoose";

export enum ERole {
  USER = "user",
  SPECIALIST = "specialist",
  SELLER = "seller",
  FREELANCER = "freelancer",
  ADMIN = "admin",
  ORGANISME = "organisme",
}
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  birthday: Date;
  password: string;
  location: string;
  avatar: {
    public_id: string;
    url: string;
  };
  contacts:string[],
  role: ERole;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "first Name is required "],
    },
    lastName: {
      type: String,
      required: [true, "last Name is required "],
    },
    email: {
      type: String,
      required: [true, "Email  is required "],
      unique: true,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    phoneNumber: {
      type: Number,
      unique: true,
      sparse: true,
    },
    birthday: Date,
    password: String,
    location: String,
    contacts: [{
      type: mongoose.Types.ObjectId,
      ref: "User"
    }],  
    role: {
      type: String,
      enum: Object.values(ERole),
      default: ERole.USER,
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model("User", userSchema);
export default User;
