import config from "../../config/index.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import status from "http-status";

const uploadSingle =  catchAsync(async(req, res, next) =>{

    const result = req.body

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "upload single file successfully",
        data: result
    })
})

const uploadMultiple =  catchAsync(async(req, res, next) =>{

    const result = req.body

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "upload multiple file successfully",
        data: result
    })
})


const uploadController = {
    uploadSingle,
    uploadMultiple
}

export default uploadController;