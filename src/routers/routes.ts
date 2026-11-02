import type { Router } from "express";
import express from "express";
import userRouter from "../modules/user/user.routes.js";
import otpRouter from "../modules/otp/otp.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";


const router:Router = express.Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRouter,
    },
    {
        path: "/otp",
        route: otpRouter,
    },
    {
        path: "/auth",
        route: authRoutes,
    },
]

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;