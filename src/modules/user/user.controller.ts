import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import userService from "./user.service.js";
import status from "http-status";

const createUser =  catchAsync(async(req, res, next) =>{
    
    const result = await userService.createUser(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "user fetched successfully",
        data: result
    })
})


const getUser =  catchAsync(async(req, res, next) =>{
    const result = await userService.getUser();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "user fetched successfully",
        data: result
    })
})

const getSingleUser =  catchAsync(async(req, res, next) =>{
    const {id} = req.params;
    const user = await userService.getSingleUser(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "user fetched successfully",
        data: user
    })
})

const deleteUser =  catchAsync(async(req, res, next) =>{
    const {id} = req.params;
    const Result = await userService.deleteUser(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "user delete successfully",
        data: Result
    })
})

const updateUser =  catchAsync(async(req, res, next) =>{
    const {id} = req.params;
    const data = req.body;

    const Result = await userService.updateUser(id, data);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "user update successfully",
        data: Result
    })
})


const userController = {
    getUser,
    createUser,
    getSingleUser,
    deleteUser,
    updateUser
}

export default userController;