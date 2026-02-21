import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(" Error:", error?.message);

  res.status(500).json({
    success: false,
    message: error?.message || "Internal Server Error",
  });
};
