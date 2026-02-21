import {
  INewsApiArticle,
  INewsDBArticle,
} from "../modules/news/news.interface";

const normStr = (v?: string | null) => (v ?? "").trim();
const normLower = (v?: string | null) => normStr(v).toLowerCase();
const normArrLower = (arr?: (string | null)[] | null) =>
  (arr ?? []).map((x) => normLower(x)).filter(Boolean);

export function normalizeNews(api: INewsApiArticle): INewsDBArticle {
  return {
    externalId: api.article_id,

    title: normStr(api.title),
    link: normStr(api.link),
    description: normStr(api.description),
    content: normStr(api.content),

    pubDate: api.pubDate ? new Date(api.pubDate) : undefined,
    language: normLower(api.language),

    //  always lowercase store
    country: normArrLower(api.country),
    category: normArrLower(api.category),
    creator: normArrLower(api.creator),

    datatype: normLower(api.datatype),

    source_id: normStr(api.source_id),
    source_name: normStr(api.source_name),
    source_url: normStr(api.source_url),
    source_icon: normStr(api.source_icon),

    image_url: api.image_url ?? null,
    video_url: api.video_url ?? null,

    fetchedAt: api.fetched_at ? new Date(api.fetched_at) : undefined,
  };
}
