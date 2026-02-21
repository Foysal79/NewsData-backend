import config from "../../config";
import { normalizeNews } from "../../utils/normalizeNews";
import { NewsDataService } from "./newsdata.service";
import { buildNewsFilter, parsePaging, NewsQueryParams } from "../../utils/queryBuilder";
import { INewsDBArticle } from "./news.interface";
import { ArticleModel } from "./news.model";


export type ApiListResponse<T> = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: T[];
};

export const NewsService = {
  //  Cron calls this: fetch → normalize → bulk upsert
  async syncLatestNewsToDB() {
    try {
      const apiResults = await NewsDataService.fetchLatestIndustryNews();

      if (!apiResults.length) {
        return { upserted: 0, modified: 0 };
      }
      const docs = apiResults
        .filter((a) => a.article_id) 
        .map(normalizeNews);

      const ops = docs.map((doc) => ({
        updateOne: {
          filter: { externalId: doc.externalId },
          update: { $set: doc },
          upsert: true,
        },
      }));
      const r = await ArticleModel.bulkWrite(ops, { ordered: false });
      return { upserted: r.upsertedCount, modified: r.modifiedCount };
    } catch (error: any) {
      console.error(" Sync service error:", error.message);
      throw new Error("Failed to sync news into database");
    }
  },

  //  Frontend calls this: ONLY DB query + filters
  async listFromDB(qp: NewsQueryParams): Promise<ApiListResponse<INewsDBArticle>> {
    try {
      const filter = buildNewsFilter(qp);
      const { page, limit, skip } = parsePaging(qp, config.defaultPageSize);

      const [items, total] = await Promise.all([
        ArticleModel.find(filter).sort({ pubDate: -1 }).skip(skip).limit(limit).lean(),
        ArticleModel.countDocuments(filter),
      ]);

      return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        items: items as INewsDBArticle[],
      };
    } catch (error: any) {
      console.error(" List service error:", error.message);
      throw new Error("Failed to fetch news from database");
    }
  },
};