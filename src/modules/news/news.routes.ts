import { Router } from "express";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";


const router = Router();

router.get("/", NewsController.getNews);
router.post("/sync", async (req, res, next) => {
  try {
    const r = await NewsService.syncLatestNewsToDB();
    res.json({ success: true, r });
  } catch (e) {
    next(e);
  }
});

export default router;