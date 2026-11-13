import { Router } from "express";
import productController from "./product.controller.js";
import auth from "../../middleware/auth.js";
import { Role } from "../../generated/prisma/enums.js";

const router:Router = Router();

router.post("/create", auth(Role.admin, Role.sub_admin, Role.supper_admin), productController.createProduct);
router.get("/products",  productController.getProducts);
// auth(Role.user, Role.admin, Role.sub_admin, Role.supper_admin),

const productRouter = router;
export default productRouter;