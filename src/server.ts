import express, {Request, Response, ErrorRequestHandler} from 'express';
import path from 'path';
import cors from 'cors';

const api = express();
const port = 3333;

api.use(cors());

api.use(express.static(path.join(__dirname, '../public')));
api.use(express.urlencoded({ extended: true }));

api.get('/', (req:Request, res: Response) => {
    res.json({
        result: "Hello World"
    })
});

api.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ error: 'Endpoint não encontrado.' });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(400); // Bad Request
    console.log(err);
    res.json({ error: 'Ocorreu algum erro.' });
}
api.use(errorHandler);


//Localhost PORT settings
api.listen(port, () => {
    console.log(`Running on Port ${port}`);
});