import catchAsync from "../utils/catchAsync.js";
import uploadToS3 from "../utils/uploadToS3.js";


const uploadSingle = (name:string, path?:string) => {
    return catchAsync(async (req, res, next) =>{
        if(req.file){
            const filePath = path? `${path}/${Math.floor(100000 + Math.random() * 900000)}` : `${Math.floor(100000 + Math.random() * 900000)}`;
            req.body[name] = await uploadToS3(req.file, filePath)
        }

        next()
    })
}

export {
    uploadSingle
}