import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { routes } from './routes';
import { AppError } from '@shared/errors/AppError';
import '@shared/typeorm'; //quando o sv entrar em conexão, ja importa o arquivo typeorm

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

/** middleware */
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    //veriricar se o error é instancia de AppError
    if (error instanceof AppError) {
      //erro gerado pela aplicação
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    if (error instanceof Error) {
      return response.status(500).json({
        //erro gerado pelo servidor
        status: 'error',
        message: error.message,
      });
    }
  },
);

app.listen(3333, () => console.log('Server started on port 3333'));

export { app };
