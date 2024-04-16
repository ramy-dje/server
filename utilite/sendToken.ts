import redis from "./redis";
import { IUser } from "../models/userModel";
import { Response, Request } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

interface TokenOptions {
  expires: Date;
  maxAge: number;
  HttpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

const accessTokenExpires = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES || "5",
  10
);

const refreshTokenExpires = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES || "7",
  10
);

export const createAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN as string, {
    expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES}m`,
  });
};

export const createRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN as string, {
    expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES}d`,
  });
};

export const accessTokenOptions: TokenOptions = {
  expires: new Date(Date.now() + accessTokenExpires * 60 * 1000),
  maxAge: accessTokenExpires * 60 * 1000,
  HttpOnly: true,
  sameSite: "lax",
};

export const refreshTokenOptions: TokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpires * 60 * 60 * 24 * 1000),
  maxAge: refreshTokenExpires * 60 * 60 * 24 * 1000,
  HttpOnly: true,
  sameSite: "lax",
};

export const SendTokens = async (
  user: IUser,
  statusCode: number,
  res: Response,
  req: Request
) => {
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);
  await redis.set(
    user._id,
    JSON.stringify(user),
    "EX",
    `${process.env.REDIS_EXPIRES_USER}`
  );

  process.env.NODE_ENV === "production"
    ? (accessTokenOptions.secure = true)
    : null;
  const { email, firstName, lastName, birthday, avatar, _id, role } = user;
  res.status(statusCode).json({
    success: true,
    user: {
      email,
      firstName,
      lastName,
      birthday,
      role,
      avatar,
      _id,
    },
    accessToken,
    refreshToken
  });
};
