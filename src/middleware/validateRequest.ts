import type { NextFunction , Response,Request } from 'express';
import type { ZodObject } from 'zod';
import catchAsync from '../utils/catchAsync.js';

const validateRequest = (schema: ZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsed = await schema.parseAsync({
      body: req.body, 
      cookies: req.cookies,
    });
    req.body = parsed.body;

    next();
  });
};

export default validateRequest;