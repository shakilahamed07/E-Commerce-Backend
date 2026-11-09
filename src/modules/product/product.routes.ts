import { Router } from "express";
import productController from "./product.controller.js";

const router:Router = Router();

router.post("/", productController.createProduct);

const productRouter = router;
export default productRouter;