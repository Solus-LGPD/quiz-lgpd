import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.json';


const prisma = new PrismaClient();


//PasswordHash
prisma.$use(async (params, next) => {

    if( params.model === "User" && params.action === "create" ) {
        const hashedPassword = await hash(params.args.data.password, 10);
        params.args.data.password = hashedPassword;
    }
    const result = await next(params)

    return result
});


//Token Generator
function generateToken(userObject: object){
    return jwt.sign(userObject, authConfig.secret, {
        expiresIn: 3600
    });
}


export const registerUser =  async (req: Request, res: Response) => {

    const email = req.body.email;
    const phone = req.body.phone;


    try{
        //Error treatment
        if(await prisma.user.findUnique({where:{email: email}})){
            return res.status(400).send({error: "Usuário já existente"});
        }
        else if(await prisma.user.findUnique({where:{phone: phone}})){
            return res.status(400).send({error: "Número de telefone já registrado"});
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

        
        user.password = '*****';


        return res.status(201).json({
            user,
            token: generateToken({id: user.id})
        });
    }
    catch(err: any){
        return res.status(400).send({error: "O registro falhou"});
    }
};


export const loginUser = async (req: Request, res: Response) => {

    const email = String(req.body.email);
    const password = String(req.body.password);


    try{
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select:{
                id: true,
                firstName: true,
                email: true,
                password: true
            }
        });

        //Error Treatment
        if(!user){
            return res.status(400).json({error: "Usuário não encontrado"});
        }
        else if(!await bcrypt.compare(password, user.password)){
            return res.status(406).json({error: "Senha inválida"});
        }


        user.password = '*****';

    
        return res.status(200).json({
            user, 
            token: generateToken({id: user.id})});
    }
    catch(err: any){
        return res.status(400).send({error: "Acesso falhou"});
    }
}