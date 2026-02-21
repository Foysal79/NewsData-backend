import { Server } from "http";
import mongoose from "mongoose";
import config from "./config";
import app from "./app";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.DATABASE_URL as string);
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  } catch (error) {
    console.log("Failed to connect to database", error);
  }
}

main();
