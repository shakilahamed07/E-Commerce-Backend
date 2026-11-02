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


export const authController = {
    login
}