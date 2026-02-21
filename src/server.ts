import { Server } from "http";
import mongoose from "mongoose";
import config from "./config";
import app from "./app";
import { startNewsCron } from "./modules/news/fetchNews.job";


let server: Server;

async function main() {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log(" MongoDB connected");

    startNewsCron();

    server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
}

main();
