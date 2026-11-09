import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import status from "http-status";

const createProduct =  catchAsync(async(req, res, next) =>{
    
    const result = await false;

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Product create successfully",
        data: result
    })
})

const productController = {
    createProduct
}

export default productController;