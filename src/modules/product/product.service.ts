import AppError from "../../middleware/AppError.js";
import prisma from "../../utils/prisma.js"
import httpStatus from "http-status"
import bcrypt from 'bcrypt';
import config from "../../config/index.js";
import type { Prisma } from "../../generated/prisma/browser.js";


const createProduct = async(Payload:any) =>{

    const {images, discount, ...others} = Payload;

    const newProduct = await prisma.products.create({
      data: {

        ...others,

        //save image table
        images: images && images.length > 0 ? {
          create: images.map((url: string) => ({ url }))
        } : undefined,

        //save discount table
        discounts: discount ? {
          create: {
            discount: parseFloat(discount.discount),
            startDate: new Date(discount.startDate),
            endDate: new Date(discount.endDate),
          }
        } : undefined

      },
      include: {
        images: true,
        category: true,
        subCategory: true,
        brand: true,
        discounts: true,
      },
    });

    if(!newProduct){
        throw new AppError(httpStatus.FAILED_DEPENDENCY, 'Product creation Unsuccessful')
    }

    return newProduct;
}

const getProducts = async () => {

    const products = await prisma.products.findMany({
      where: {
        isDeleted: false 
      },
      include: {
        images: true,
        category: true,
        subCategory: true,
        brand: true,
        discounts: true,
      },
    });

    return products;
}


const productService = {
    createProduct,
    getProducts
}

export default productService;