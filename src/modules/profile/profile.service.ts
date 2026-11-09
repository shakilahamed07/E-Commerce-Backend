import AppError from "../../middleware/AppError.js";
import prisma from "../../utils/prisma.js"
import httpStatus from "http-status"
import bcrypt from 'bcrypt';
import config from "../../config/index.js";
import type { email } from "zod";

const getProfile = async (userId:string) => {
    console.log(userId)
    const result = await prisma.user.findUnique({
        where:{
            id:userId,
            status:"active",
            isDeleted: false
        }
    })

    if(!result){
        throw new AppError(httpStatus.FAILED_DEPENDENCY, 'Profile not found!')
    }

    return result;
}


const updateProfile = async(userId:string, updateData:object) =>{
    const updateUser = await prisma.user.update({
        where: {id: userId},
        data: updateData
    })

    if(!updateUser){
        throw new AppError(httpStatus.FAILED_DEPENDENCY, 'Profile Update Unsuccessful')
    }

    return {
       id: updateUser.id,
       email: updateUser.email
    };
}

const deleteUser = async(id:string) =>{
    const Result = await prisma.user.update({
        where:{
            id:id,
        },
        data:{
            isDeleted:true
        }
    })

    if(!Result){
        throw new AppError(httpStatus.FAILED_DEPENDENCY, 'User Delete Unsuccessfull')
    }

    return {
        id: Result.id,
        email: Result.email
    };
}


const profileService = {
    updateProfile,
    getProfile,
    deleteUser
}

export default profileService;