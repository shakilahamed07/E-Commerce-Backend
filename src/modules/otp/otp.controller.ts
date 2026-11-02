import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import otpService from './otp.service.js';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';

const resendOtp = catchAsync(async (req:Request, res:Response) => {

const result = await otpService.resendOtp(req.body.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP sent successfully',
    data: result,
  });
});

const otpController = {
  resendOtp,
};

export default otpController;