import { Request, Response, NextFunction } from "express";
import { NewsQueryParams } from "../../utils/queryBuilder";
import { NewsService } from "./news.service";

export const NewsController = {
  async getNews(req: Request<{}, {}, {}, NewsQueryParams>, res: Response, next: NextFunction) {
    try {
      const data = await NewsService.listFromDB(req.query);

      res.status(200).json({
        success: true,
        message: "News fetched from database",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};