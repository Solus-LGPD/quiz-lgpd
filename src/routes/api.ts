import { Router, Request, Response } from 'express';
import * as AuthController from '../controllers/auth.controller';
import * as ValidationController from '../controllers/validation.controller';
import * as LeadController from '../controllers/lead.controller';
import * as QuizController from '../controllers/quiz.controller';
import authMiddleware from '../middlewares/auth';


export const router = Router();


//Test Endpoint
router.get('/test', (req:Request, res: Response) => {
    res.json({
        result: "Hello World",
    });
    res.status(200);
});


//Leads Endpoint
router.get('/lead', LeadController.handleData);


//Authentication Endpoints
router.post('/auth/register', AuthController.registerUser);
router.post('/auth/login', AuthController.loginUser);
router.use(authMiddleware);
router.get('/auth/validation', ValidationController.test);


//Quiz Endpoint
router.post('/quiz/register', QuizController.registerQuiz);



export default router;