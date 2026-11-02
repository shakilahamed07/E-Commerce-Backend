import { Router } from "express";
import otpController from "./otp.controller.js";

const router: Router = Router();

router.post("/resend-otp", otpController.resendOtp);
router.post("/verify-otp", otpController.verifyOtp);

const otpRouter = router;
export default otpRouter;