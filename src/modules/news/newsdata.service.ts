import axios from "axios";
import config from "../../config";
import { INewsApiArticle } from "./news.interface";

type NewsDataResponse = {
  status: string;
  results?: INewsApiArticle[];
};

export const NewsDataService = {
  async fetchLatestIndustryNews() {
    try {
    
      const res = await axios.get<NewsDataResponse>(config.newsBaseUrl, {
        params: {
          apikey: config.newsApiKey,
         
        },
        timeout: 15000,
      });

      if (!res.data || res.data.status !== "success") {
        throw new Error("Invalid response from NewsData");
      }

      return res.data.results ?? [];
    } catch (error: any) {
      console.error(" NewsData fetch error:", error.message);
      throw new Error("Failed to fetch latest industry news");
    }
  },
};