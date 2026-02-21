import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes";
const app: Application = express();

// parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5000"],
  }),
);
// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(req.method, req.url);
//   next();
// });

// app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the appointment Management System API");
});
export default app;
