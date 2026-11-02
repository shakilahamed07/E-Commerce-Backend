import { Router } from "express";
import otpController from "./otp.controller.js";

const router: Router = Router();

router.post("/", otpController.resendOtp);

const otpRouter = router;
export default otpRouter;