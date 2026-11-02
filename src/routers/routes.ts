import type { Router } from "express";
import express from "express";
import userRouter from "../modules/user/user.routes.js";


const router:Router = express.Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRouter,
    },
]

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;