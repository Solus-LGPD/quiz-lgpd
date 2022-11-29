import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';


const prisma = new PrismaClient();


export const registerQuiz = async (req: Request, res: Response) => {
    const id = req.body.userId;
    try{
        if(!await prisma.user.findUnique({where:{id:id}})){
            res.status(400).send({error: "Usuário não encontrado"});
        }

        const registerResult = z.object({
            result: z.string(),
            userId: z.string(),
        });

        const quizData = registerResult.parse(req.body);

        const result = await prisma.quiz.create({
            data:{
                result: quizData.result,
                userId: quizData.userId
            }
        });

        res.status(201).json({
            result,
            msg: "Resultado registrado"
        });
    }
    catch(err: any){
        res.status(400).json({msg: "Resultado de registro falhou"});
    }
}