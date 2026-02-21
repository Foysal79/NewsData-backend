export type Nullable<T> = T | null;

export interface INewsApiArticle {
  article_id: string;
  link: string;

  title?: string;
  description?: string;
  content?: string;

  keywords?: Nullable<string[]>;
  creator?: Nullable<string[]>;

  language?: string;
  country?: string[];
  category?: string[];
  datatype?: string;

  pubDate?: string;
  pubDateTZ?: string;
  fetched_at?: string;

  image_url?: Nullable<string>;
  video_url?: Nullable<string>;

  source_id?: string;
  source_name?: string;
  source_priority?: number;
  source_url?: string;
  source_icon?: string;

  sentiment?: string;
  sentiment_stats?: string;

  ai_tag?: string;
  ai_region?: string;
  ai_org?: string;
  ai_summary?: string;

  duplicate?: boolean;
}

export interface INewsDBArticle {
  externalId: string;

  title?: string;
  link?: string;
  description?: string;
  content?: string;

  pubDate?: Date;
  language?: string;

  country: string[];
  category: string[];
  creator: string[];

  source_id?: string;
  source_name?: string;
  source_url?: string;
  source_icon?: string;

  image_url?: string | null;
  video_url?: string | null;

  datatype?: string;
  fetchedAt?: Date;
}
