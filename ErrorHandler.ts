import { Response } from "express";
const ErrorHandler = (err: any, status: number, res: Response) => {
  if (err.code === 11000) {
    return `Duplicate ${err}`;
    return `Duplicate ${Object.values(err.keyValue)}`;
  }
  console.log(err);
  res.status(status).json({ err: err.message });
};
export default ErrorHandler;
