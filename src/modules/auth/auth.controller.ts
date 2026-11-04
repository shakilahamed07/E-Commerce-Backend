import  httpStatus  from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import authService from './auth.service.js';


const login = catchAsync(async(req, res, next)=>{
   
const result = await authService.login(req.body) 

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true, 
        message:"user login successfully",
        data: result
    })
})

const changePassword = catchAsync(async(req, res, next)=>{

const result = await authService.changePassword(req.user?.id , req.body) 

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true,
        message:"user password changed successfully",
        data: result
    })
})

const forgotPassword = catchAsync(async(req, res, next)=>{

const result = await authService.forgotPassword(req.body) 

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true,
        message:"user password reset link sent successfully",
        data: result
    })
})

const resetPassword = catchAsync(async(req, res, next)=>{

const result = await authService.resetPassword(req.user.id, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true,
        message:"user password reset successfully",
        data: result
    })
})


export const authController = {
    login,
    changePassword,
    forgotPassword,
    resetPassword
}