import catchAsync from "../utils/catchAsync.js";
import uploadToS3 from "../utils/uploadToS3.js";
import _ from "lodash";

interface IMultipleParams {
  name: string;
  maxCount: number;
  path?: string;
}

const uploadSingle = (name: string, path?: string) => {
  return catchAsync(async (req, res, next) => {
    if (req.file) {
      const filePath = path
        ? `${path}/${Math.floor(100000 + Math.random() * 900000)}`
        : `${Math.floor(100000 + Math.random() * 900000)}`;
      req.body[name] = await uploadToS3(req.file, filePath);
    }

    next();
  });
};

const uploadMultiple = (files: IMultipleParams[]) => {
  return catchAsync(async (req, res, next) => {
    if (_.isEmpty(files)) return next();

    await Promise.all(
      files.map(async (filed) => {
        const { name, path } = filed;

        const fieldFiles = _.get(req.files, name);

        if (!fieldFiles && fieldFiles.length === 0) return;

        const filePath = filed?.path
          ? `${path}/${Math.floor(100000 + Math.random() * 900000)}`
          : `${Math.floor(100000 + Math.random() * 900000)}`;

        const uploadUrls: any[] = [];

        await Promise.all(
          fieldFiles.map(async (file: any) => {
            const uploadUrl = await uploadToS3(file, filePath);
            uploadUrls.push(uploadUrl);
          }),
        );

        _.set(req.body, filed.name, uploadUrls);
      }),
    );

    next();
  });
};

export { uploadSingle, uploadMultiple };
