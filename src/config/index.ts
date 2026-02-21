import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export default {
  port: Number(process.env.PORT || 5000),
  mongoUrl: process.env.MONGO_URL as string,
  newsApiKey: process.env.NEWSDATA_API_KEY as string,
  newsBaseUrl:
    process.env.NEWSDATA_BASE_URL || "https://newsdata.io/api/1/latest",
  cronSchedule: process.env.CRON_SCHEDULE || "0 */6 * * *",
  defaultPageSize: Number(process.env.DEFAULT_PAGE_SIZE || 20),
};
