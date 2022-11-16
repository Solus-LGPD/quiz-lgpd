import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


export const handleData = async (req: Request, res: Response) => {
    const leads = await prisma.user.findMany({
        select: {
            firstName: true,
            phone: true,
            email: true,
            companyName: true,
            quizzes: {select:{
                createdAt:true,
                result: true,
                id: false,
                userId: false
            }},
            lastName: false,
            createdAt: false,
            password: false,
            id: false
        }
    });

    res.status(200).send({leads});
}