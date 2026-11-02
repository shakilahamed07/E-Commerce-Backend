
import { ZodError, type ZodIssue } from 'zod'; 
import type { TGenericErrorResponse } from '../interface/error.js';


const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: any = err.issues.map((issue: ZodIssue) => {
    const path = issue.path[issue.path.length - 1];

    return {
      path: typeof path === 'string' || typeof path === 'number' ? path : null,
      message: issue.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};


 

export default handleZodError;