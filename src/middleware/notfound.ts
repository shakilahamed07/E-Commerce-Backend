import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status"

const notFound = (req:Request, res:Response, next:NextFunction) =>{
    return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        success: false,
        message: "Route not found",
        error: "",
    })
}

export default notFound;