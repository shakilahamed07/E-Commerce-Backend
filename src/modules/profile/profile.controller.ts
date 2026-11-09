import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import status from "http-status";
import profileService from "./profile.service.js";

const getProfile =  catchAsync(async(req, res, next) =>{

    const result = await profileService.getProfile(req.user.id)

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Profile fetch successfully",
        data: result
    })
})

const updateProfile =  catchAsync(async(req, res, next) =>{

    const result = await profileService.updateProfile(req.user.id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Profile update successfully",
        data: result
    })
})

const deleteProfile =  catchAsync(async(req, res, next) =>{

    const result = await profileService.deleteUser(req.user.id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Profile delete successfully",
        data: result
    })
})

const profileController = {
    updateProfile,
    getProfile,
    deleteProfile
}

export default profileController;