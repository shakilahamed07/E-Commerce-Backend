import type { Prisma } from "@prisma/client";
import AppError from "../../middleware/AppError.js";
import prisma from "../../utils/prisma.js"
import httpStatus from "http-status"
import bcrypt from 'bcrypt';
import config from "../../config/index.js";


const createUser = async(payload:Prisma.UserCreateInput) =>{

    try {
    const isExist = await prisma.user.findFirst({
      where: {
        email: payload.email,
      },
      include: {
        verification: {
          select: {
            status: true,
          },
        },
      },
    });

    if (isExist) { 
      throw new AppError(
        httpStatus.CONFLICT,
        'User already exists and is verified',
      );
    }
    
    payload['password'] =  await bcrypt.hash(payload.password, Number(config.salt_rounds) || 10);

    const result = await prisma.user.create({ data: payload });

    return result;

  } catch (error: any) {
    throw new AppError(httpStatus?.BAD_GATEWAY, error?.message);
  }
}

const getUser = async() =>{
    const data = await prisma.user.findMany();

    if(!data){
        throw new AppError(httpStatus.NOT_FOUND, 'User Data Not Found')
    }

    return data;
}

const getSingleUser = async(id:any) =>{
    const user = await prisma.user.findUnique({
        where:{
            id: id,
        }
    });

    if(!user){
        throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
    }

    return user;
}

const deleteUser = async(id:any) =>{
    const Result = await prisma.user.delete({
        where:{
            id:id,
        }
    })

    if(!Result){
        throw new AppError(httpStatus.FAILED_DEPENDENCY, 'User Delete Unsuccessfull')
    }

    return Result;
}

const updateUser = async(userId:any, updateData:object) =>{
    const updateUser = await prisma.user.update({
        where: {id: userId},
        data: updateData
    })

    if(!updateUser){
        throw new AppError(httpStatus.FAILED_DEPENDENCY, 'User Update Unsuccessfull')
    }

    return updateUser;
}


const userService = {
    getUser,
    createUser,
    getSingleUser,
    deleteUser,
    updateUser
}

export default userService;