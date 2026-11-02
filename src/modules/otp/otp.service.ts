import AppError from "../../middleware/AppError.js";
import httpStatus from "http-status";
import prisma from "../../utils/prisma.js";
import generateOtp from "../../utils/otpGenerator.js";
import moment from "moment";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config/index.js";
import path from "path";
import sendEmail from "../../utils/mailSender.js";
import fs from "fs";

const resendOtp = async (payload: { email: string }) => {
  try {
    // find the user by email
    const user = await prisma.user.findFirst({
      where: {
        email: payload?.email,
      },
    });

    // if user not found, throw an error
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // generate a new otp
    const otp = generateOtp();
    const expiresAt = moment().utc().add(3, "minutes");

    // update the user with the new otp and expiration time
    const updateOtp = await prisma.verification.upsert({
      where: {
        userId: user.id,
      },
      update: {
        otp: Number(otp),
        expiredAt: expiresAt.toDate(),
        status: false,
      },

      create: {
        userId: user.id,
        otp: Number(otp),
        expiredAt: expiresAt.toDate(),
        status: false,
      },
    });

    if (!updateOtp) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update OTP",
      );
    }

    const otpPayload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(otpPayload, config.jwt_secret as string, {
      expiresIn: "3m",
    });

    const otpEmailPath = path.join(process.cwd(),"public/view/verification.html",);

    let emailHtml = fs.readFileSync(otpEmailPath, "utf-8");

    emailHtml = emailHtml
      .replace("{{userName}}", user?.name || "User")
      .replace("{{otpCode}}", String(otp));

    await sendEmail(
      user?.email,
      "Your One-time OTP Code",
      emailHtml,
    );

    return {
      token,
      otp: otp,
      expiresAt: expiresAt.toISOString(),
    };
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error?.message);
  }
};

const otpService = {
  resendOtp,
};

export default otpService;
