import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import status from "http-status";
import productService from "./product.service.js";

const createProduct =  catchAsync(async(req, res, next) =>{
    
    const result = await productService.createProduct(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Product create successfully",
        data: result
    })
})

const getProducts =  catchAsync(async(req, res, next) =>{
    
    const result = await productService.getProducts();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Products get successfully",
        data: result
    })
})

const productController = {
    createProduct,
    getProducts
}

export default productController;