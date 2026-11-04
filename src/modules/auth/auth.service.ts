import AppError from "../../middleware/AppError.js";
import httpStatus from "http-status";
import prisma from "../../utils/prisma.js";
import isPasswordValid from "../auth/auth.utils.js";
import config from "../../config/index.js";
import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import generateOtp from "../../utils/otpGenerator.js";
import moment from "moment";
import path from "path/win32";
import sendEmail from "../../utils/mailSender.js";
import fs from "fs";

const login = async (payload: { email: string; password: string }) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: payload?.email,
      },
      include: {
        verification: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
    if (isPasswordValid(payload.password, user.password) === false)
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
    if (!user?.verification?.status)
      throw new AppError(httpStatus.UNAUTHORIZED, "User is not verified");
    if (user?.isDeleted)
      throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted");
    if (user?.status === "blocked")
      throw new AppError(httpStatus.UNAUTHORIZED, "User is blocked");

    const jwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const options = {
      expiresIn: (config.jwt_access_expires_in ||
        "3d") as SignOptions["expiresIn"],
    };

    const refreshOptions = {
      expiresIn: (config.jwt_refresh_expires_in ||
        "7d") as SignOptions["expiresIn"],
    };

    const accessToken = jwt.sign(
      jwtPayload,
      config.jwt_secret as string,
      options,
    );
    const refreshToken = jwt.sign(
      jwtPayload,
      config.jwt_secret as string,
      refreshOptions,
    );

    return { accessToken, refreshToken };
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error?.message);
  }
};

const changePassword = async (
  id: string,
  payload: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  if (user.isDeleted)
    throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted");
  if (user.status === "blocked")
    throw new AppError(httpStatus.UNAUTHORIZED, "User is blocked");
  if (isPasswordValid(payload.oldPassword, user.password) === false)
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid old password");
  if (payload.newPassword !== payload.confirmPassword)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password and confirm password do not match",
    );
  if (payload.oldPassword === payload.newPassword)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password cannot be the same as old password",
    );

  const passwordHash = await bcrypt.hash(
    payload.newPassword,
    Number(config.salt_rounds),
  );
  const updateUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      password: passwordHash,
    },
  });

  return {
    user: updateUser?.name,
    email: updateUser?.email,
    id: updateUser?.id,
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findFirst({
    where: {
      email: payload?.email,
    },
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  if (user.isDeleted)
    throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted");
  if (user.status === "blocked")
    throw new AppError(httpStatus.UNAUTHORIZED, "User is blocked");

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const otpToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "3m",
  });
  const otp = generateOtp();
  const expirationTime = moment().add(3, "m");

  const updateUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      needToPasswordChange: true,
      verification: {
        update: {
          data: {
            otp: Number(otp),
            expiredAt: expirationTime.toDate(),
          },
        },
      },
    },
    include: {
      verification: true,
    },
  });

  const otpHtmlPath = path.join(process.cwd(), "public/view/forget_pass.html");

  await sendEmail(
    user?.email,
    "Password Reset OTP",
    fs
      .readFileSync(otpHtmlPath, "utf-8")
      .replace("{{user_name}}", user.name)
      .replace("{{otp_code}}", otp),
  );

  return {
    token: otpToken,
    user: {
      name: updateUser?.name,
      email: updateUser?.email,
      id: updateUser?.id,
    },
  };
};

const resetPassword = async (id: string, payload: { newPassword: string; confirmPassword: string }) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
    if (user.isDeleted) throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted");
    if (user.status === "blocked") throw new AppError(httpStatus.UNAUTHORIZED, "User is blocked");
    if (payload.newPassword !== payload.confirmPassword) throw new AppError(httpStatus.BAD_REQUEST, "New password and confirm password do not match");

    const passwordHash = await bcrypt.hash(payload.newPassword, Number(config.salt_rounds));
    const updateUser = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            password: passwordHash,
            needToPasswordChange: false
        }
    });

    return {
        user:{
            name: updateUser?.name,
            email: updateUser?.email,
            id: updateUser?.id
        }
    }
}

const authService = {
  login,
  changePassword,
  forgotPassword,
  resetPassword
};

export default authService;
