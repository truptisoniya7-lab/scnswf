import { Request, Response } from 'express';
import { newsletterRepo } from '../../db';
import { sendSuccess } from '../../utils/response';

export const newsletterController = {
  subscribe: async (req: Request, res: Response): Promise<void> => {
    const subscriber = newsletterRepo.subscribe(req.body.email);
    sendSuccess(
      res,
      {
        message: 'Subscribed successfully.',
        email: subscriber?.email,
      },
      201
    );
  },
};
