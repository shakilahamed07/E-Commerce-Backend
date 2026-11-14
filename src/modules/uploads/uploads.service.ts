import AppError from "../../middleware/AppError.js";
import prisma from "../../utils/prisma.js"
import httpStatus from "http-status"
import config from "../../config/index.js";

const uploadSingle = async(id:string) =>{
    
}

const uploadMultiple = async(id:string) =>{
    
}


const uploadService = {
    uploadSingle,
    uploadMultiple
}

export default uploadService;