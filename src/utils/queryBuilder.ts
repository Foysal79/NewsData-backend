export type NewsQueryParams = {
  page?: string;
  limit?: string;

  from?: string;
  to?: string;

  author?: string;
  language?: string;
  country?: string; // can be single or comma-separated
  category?: string; // comma-separated
  datatype?: string;

  q?: string;
};

const clean = (v?: string) => (v ?? "").trim().toLowerCase();
const cleanList = (v?: string) =>
  clean(v)
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

  // language (stored lowercase)
  if (qp.language) filter.language = clean(qp.language);

  // datatype (stored lowercase)
  if (qp.datatype) filter.datatype = clean(qp.datatype);

  // country: stored as array lowercase => match any selected country
  if (qp.country) {
    const countries = cleanList(qp.country);
    if (countries.length) filter.country = { $in: countries };
  }

  //  category: OR match (any selected). (If you want AND, tell me)
  if (qp.category) {
    const cats = cleanList(qp.category);
    if (cats.length) filter.category = { $in: cats };
  }

  // author: creator array match OR fallback source_name match
  if (qp.author) {
    const a = clean(qp.author);
    // creator is array lowercase -> match element
    filter.$or = [
      { creator: a },
      { source_name: new RegExp(escapeRegex(qp.author.trim()), "i") },
    ];
  }

  // optional full text search
  if (qp.q) {
    const r = new RegExp(escapeRegex(qp.q.trim()), "i");
    const prevOr = filter.$or ? filter.$or : null;

    const searchOr = [{ title: r }, { description: r }, { content: r }];

    // if author already created $or, we AND them by nesting:
    if (prevOr) {
      delete filter.$or;
      filter.$and = [{ $or: prevOr }, { $or: searchOr }];
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
