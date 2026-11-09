import AppError from "../../middleware/AppError.js";
import prisma from "../../utils/prisma.js"
import httpStatus from "http-status"
import bcrypt from 'bcrypt';
import config from "../../config/index.js";


const createProduct = async(userId:string, updateData:object) =>{
    const updateUser = await prisma.user.update({
        where: {id: userId},
        data: updateData
    })

    if(!updateUser){
        throw new AppError(httpStatus.FAILED_DEPENDENCY, 'Profile Update Unsuccessful')
    }

    return updateUser;
}


const productService = {
    createProduct
}

export default productService;