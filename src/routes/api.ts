import { Router, Request, Response } from 'express';
import * as AuthController from '../controllers/auth.controller';


export const router = Router();

//Test Endpoint
router.get('/test', (req:Request, res: Response) => {
    res.json({
        result: "Hello World"
    });
    res.status(200);
});


//Authentication Endpoints
router.post('/auth/register', AuthController.registerUser);
router.post('/auth/login', AuthController.loginUser);







export default router;