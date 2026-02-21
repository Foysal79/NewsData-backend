import { Router } from "express";


const router = Router();
const moduleRRouter  = [
    {
        path : "";
        route : 
    }
]

moduleRRouter.forEach((route) => router.use(route.path, route.route));
export default router;
