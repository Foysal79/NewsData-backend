import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";


const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the news data API");
});

app.use(globalErrorHandler);


export default app;
