import { Request, Response } from 'express';
import authValidation from '../middlewares/auth'




export const test = async (req: Request, res: Response) => {
    return res.status(200).send({
        ok: true,    
    });
}