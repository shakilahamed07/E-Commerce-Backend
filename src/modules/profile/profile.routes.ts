import { Router } from "express";
import profileController from "./profile.controller.js";
import auth from "../../middleware/auth.js";
import { Role } from "../../generated/prisma/enums.js";

const router:Router = Router();

router.get("/get-profile", auth(Role.admin, Role.sub_admin, Role.supper_admin, Role.user), profileController.getProfile);
router.patch("/update-profile", auth(Role.admin, Role.sub_admin, Role.supper_admin, Role.user), profileController.updateProfile);
router.delete("/delete-profile", auth(Role.admin, Role.sub_admin, Role.supper_admin, Role.user), profileController.deleteProfile);

const profileRouter = router;
export default profileRouter;