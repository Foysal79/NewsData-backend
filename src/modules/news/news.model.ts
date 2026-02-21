import { Schema, model } from "mongoose";
import { INewsDBArticle } from "./news.interface";

const ArticleSchema = new Schema<INewsDBArticle>(
  {
    externalId: { type: String, required: true, unique: true, index: true },

    title: String,
    link: String,
    description: String,
    content: String,

    pubDate: { type: Date, index: true },
    language: { type: String, index: true },

    country: { type: [String], default: [], index: true },
    category: { type: [String], default: [], index: true },
    creator: { type: [String], default: [], index: true },

    source_id: String,
    source_name: String,
    source_url: String,
    source_icon: String,

    image_url: { type: String, default: null },
    video_url: { type: String, default: null },

    datatype: { type: String, index: true },
    fetchedAt: { type: Date },
  },
  { timestamps: true },
);

ArticleSchema.index({ pubDate: -1 });

export const ArticleModel = model<INewsDBArticle>("Article", ArticleSchema);
