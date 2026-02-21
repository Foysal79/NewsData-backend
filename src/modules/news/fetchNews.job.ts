import cron from "node-cron";
import { NewsService } from "./news.service";
import config from "../../config";


async function runOnce() {
  try {
    console.log(" Cron: syncing latest news...");
    const result = await NewsService.syncLatestNewsToDB();
    console.log(` Synced. upserted=${result.upserted}, modified=${result.modified}`);
  } catch (error: any) {
    console.error(" Cron sync failed:", error.message);
  }
}

export function startNewsCron() {
  // run immediately on startup
  runOnce();

  // schedule every 6 hours (default)
  cron.schedule(config.cronSchedule, async () => {
    await runOnce();
  });

  console.log(` Cron scheduled: ${config.cronSchedule}`);
}