import { PutObjectCommand } from "@aws-sdk/client-s3"
import httpStatus from "http-status"
import config from "../config/index.js"
import AppError from "../middleware/AppError.js"
import s3Client from "../constant/aws.js"

const uploadToS3 = async (file:any, filePathName:string) => {
    const command = new PutObjectCommand({
        Bucket: config.aws_bucket_name,
        Key: filePathName,
        Body: file.buffer,
        ContentType: file.mimetype
    })

    try {
        const key = await s3Client.send(command);
        if(!key) throw new AppError(httpStatus.BAD_REQUEST, "File upload filed!")
        
        const url = `https://${config.aws_bucket_name}.s3.${config.aws_bucket_region}.amazonaws.com/${filePathName}`
        return url;

    } catch (error) {
        console.error("🚀 ~ uploadToS3 ~ error:", error)
        throw new AppError(httpStatus.BAD_REQUEST, "File upload filed!")
    }
}

export default uploadToS3;