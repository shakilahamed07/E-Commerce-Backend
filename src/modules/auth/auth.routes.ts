import { Router } from "express";
import { authController } from "./auth.controller.js";
import auth from "../../middleware/auth.js";
import { Role } from "../../generated/prisma/enums.js";

const router = Router()

router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);

router.post('/change-password', auth(Role.admin, Role.sub_admin, Role.supper_admin, Role.user), authController.changePassword);
router.post('/reset-password', auth(Role.admin, Role.sub_admin, Role.supper_admin, Role.user), authController.resetPassword);

const authRoutes = router

export default authRoutes