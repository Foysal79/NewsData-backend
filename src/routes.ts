import { Router } from "express";
import newsRoutes from "./modules/news/news.routes";

const router = Router();

const moduleRouter = [
  {
    path: "/news",
    route: newsRoutes,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.route));

export default router;
