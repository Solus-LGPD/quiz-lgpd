import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {

    if( params.model === "User" && params.action === "create" ) {
        const hashedPassword = await hash(params.args.data.password, 10);
        params.args.data.password = hashedPassword;
    }
    const result = await next(params)

    return result
});


export const registerUser =  async (req: Request, res: Response) => {
    const email = req.body.email;
    const phone = req.body.phone;

    try{
        //Error treatment
        if(await prisma.user.findUnique({where:{email: email}})){
            res.status(400).send({error: "User already exists"});
        }
        else if(await prisma.user.findUnique({where:{phone: phone}})){
            res.status(400).send({error: "Phone number already registered"});
        }

        //Data validation with Zod
        const createUser = z.object({
            firstName: z.string(),
            lastName: z.string(),
            companyName: z.string(),
            email: z.string(),
            phone: z.string(),
            password: z.string(),
        });


        const userData = createUser.parse(req.body)


        const user = await prisma.user.create({
            data: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                companyName: userData.companyName,
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
            }
        });

        
        userData.password = '****';
        res.status(201).json({user: user});
    }
    catch(err: any){
        res.status(400).send({error: "Registration Failed"});
    }
};
