import AppError from "../../middleware/AppError.js";
import  httpStatus  from 'http-status';
import prisma from "../../utils/prisma.js";
import isPasswordValid from "../auth/auth.utils.js";
import config from "../../config/index.js";
import jwt, { type SignOptions } from "jsonwebtoken";

const login =  async(payload: { email: string; password: string }) =>{
    try{
        const user = await prisma.user.findFirst({
            where:{
                email: payload?.email
            },
            include:{
                verification:{
                    select:{
                        status:true
                    }
                }
            }
        });

        if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
        if(isPasswordValid(payload.password, user.password) === false) throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
        if(!user?.verification?.status) throw new AppError(httpStatus.UNAUTHORIZED, "User is not verified");
        if(user?.isDeleted) throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted");
        if(user?.status === "blocked") throw new AppError(httpStatus.UNAUTHORIZED, "User is blocked");

        const jwtPayload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        const options = {
            expiresIn: (config.jwt_access_expires_in || "3d") as SignOptions["expiresIn"],
        };

        const refreshOptions = {
            expiresIn: (config.jwt_refresh_expires_in || "7d") as SignOptions["expiresIn"],
        };

        const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, options);
        const refreshToken = jwt.sign(jwtPayload, config.jwt_secret as string, refreshOptions);

        return { accessToken, refreshToken };

    }
    catch(error:any){
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error?.message)
    }
}

const authService = {
    login
}

export default authService;