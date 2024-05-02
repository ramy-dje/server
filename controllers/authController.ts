import User, { IUser, ERole } from "../models/userModel";
import { Response, Request } from "express";
import ErrorHandler from "../ErrorHandler";
import bcrypt from "bcrypt";
import sendMail from "../utilite/sendMail";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import { SendTokens } from "../utilite/sendToken";
import jwt, { JwtPayload } from "jsonwebtoken";

const createToken = (user: IUser) => {
  const activation = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign({ user, activation }, `${process.env.TOKEN_SECRET}`, {
    expiresIn: "7d",
  });
  return { token, activation };
};

export const SignUp = async (req: Request, res: Response) => {
  try {
    const { user }: { user: IUser } = req.body;
    if(!user){
      throw new Error("no user exists");
    }
    const isExist = await User.findOne({ email: user.email });
    if (isExist) {
      throw new Error("Email already exists");
    }
    const { token, activation } = createToken(user);
    const template = fs.readFileSync(
      path.join(__dirname, "", "../mails/mail.ejs"),
      "utf8"
    );
    const html = ejs.render(template, {
      activationCode: activation,
      username: user.email,
    });
    const mailOptions = {
      html,
      email: user.email,
      from: "Vertic City",
      data: activation,
      subject: "Your activation code",
    };
    await sendMail(mailOptions);
   
    res.status(200).json({ token, activation });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const Activation = async (req: Request, res: Response) => {
  try {
    const activationCode = req.body.activationCode;
    const authHeader : any = req.headers['jwt'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new Error("Invalid Token , You have to Sign Up  again.");
    }
    const { user, activation } = jwt.verify(
      token,
      `${process.env.TOKEN_SECRET}`
    ) as {
      user: IUser;
      activation: string;
    };
    const isExist = await User.findOne({ email: user.email });
    if (isExist) {
      throw new Error("Email already exists");
    }
    if (activationCode.toString() !== activation) {
      throw new Error("Invalid activation Code");
    }
    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    const newUser = await User.create(user);
    if (!newUser) {
      throw new Error("user is not created");
    }
    // handle tokens
    SendTokens(newUser, 200, res, req);
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email not found");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("Password is incorrect");
    }
    console.log('user logged in')
    SendTokens(user, 200, res, req);
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const role: ERole = req.body.role.toLowerCase();
    if (!Object.values(ERole).includes(role)) {
      throw new Error("This role is not defined");
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) {
      throw new Error("Canot update user role");
    }
    SendTokens(user, 200, res, req);
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
