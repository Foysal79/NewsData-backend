export type NewsQueryParams = {
  page?: string;
  limit?: string;

  from?: string;
  to?: string;

  author?: string;
  language?: string;
  country?: string;   // single or comma-separated
  category?: string;  // comma-separated
  datatype?: string;

  q?: string;
};

const splitList = (v?: string) =>
  (v ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export function buildNewsFilter(qp: NewsQueryParams) {
  const filter: any = {};

  //  Date range
  if (qp.from || qp.to) {
    filter.pubDate = {};
    if (qp.from) filter.pubDate.$gte = new Date(qp.from);
    if (qp.to) {
      const end = new Date(qp.to);
      end.setHours(23, 59, 59, 999);
      filter.pubDate.$lte = end;
    }
  }

  //  language (case-insensitive exact)
  if (qp.language) {
    filter.language = new RegExp(`^${escapeRegex(qp.language.trim())}$`, "i");
  }

  //  datatype (case-insensitive exact)
  if (qp.datatype) {
    filter.datatype = new RegExp(`^${escapeRegex(qp.datatype.trim())}$`, "i");
  }

  //  country (array-safe): match ANY selected country (case-insensitive)
  if (qp.country) {
    const countries = splitList(qp.country).map(
      (c) => new RegExp(`^${escapeRegex(c)}$`, "i")
    );
    if (countries.length) filter.country = { $in: countries };
  }

  //  category (array-safe): match ANY selected category (case-insensitive)
  if (qp.category) {
    const cats = splitList(qp.category).map(
      (c) => new RegExp(`^${escapeRegex(c)}$`, "i")
    );
    if (cats.length) filter.category = { $in: cats };
  }

  //  author (creator array) — robust match
  // NOTE: many articles have creator null/[] so author filter can return 0 (that's real data)
  if (qp.author) {
    const r = new RegExp(escapeRegex(qp.author.trim()), "i");
    filter.$or = [
      { creator: r },         // creator array element match
      { source_name: r },     // fallback match
    ];
  }

  // optional search
  if (qp.q) {
    const r = new RegExp(escapeRegex(qp.q.trim()), "i");
    const searchOr = [{ title: r }, { description: r }, { content: r }];

    // if author already made $or -> AND them properly
    if (filter.$or) {
      const authorOr = filter.$or;
      delete filter.$or;
      filter.$and = [{ $or: authorOr }, { $or: searchOr }];
    } else {
      filter.$or = searchOr;
    }
  }

  return filter;
}

export function parsePaging(qp: NewsQueryParams, defaultLimit: number) {
  const page = Math.max(1, Number(qp.page || 1));
  const limit = Math.min(100, Math.max(1, Number(qp.limit || defaultLimit)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}