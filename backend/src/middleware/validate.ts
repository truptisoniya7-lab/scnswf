import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validateRequest = (schema: {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = (await schema.query.parseAsync(req.query)) as any;
      }
      if (schema.params) {
        req.params = (await schema.params.parseAsync(req.params)) as any;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const flattened = error.flatten();
        const details: Record<string, string[]> = {};

        for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
          if (messages && messages.length > 0) {
            details[key] = messages;
          }
        }

        if (flattened.formErrors && flattened.formErrors.length > 0) {
          details.non_field_errors = flattened.formErrors;
        }

        sendError(
          res,
          400,
          'validation_error',
          'One or more fields are invalid.',
          details
        );
        return;
      }
      next(error);
    }
  };
};
