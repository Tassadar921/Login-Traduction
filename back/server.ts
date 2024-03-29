import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';

import http from 'http';

import boot from './modules/boot/boot';

import accountRouting from './modules/account/accountRouting';
import languagesRouting from './modules/languages/languagesRouting';
import ioServer from './modules/common/socket/socket';
import logger from './modules/common/logger/logger';
import errorHandler from './modules/common/errorHandler/errorHandler';
import { prisma } from './modules/common/prisma/prismaClient';

prisma.$on('warn', (event) => {
    logger.logger.warn(event)
})

prisma.$on('info', (event) => {
    logger.logger.info(event)
})

prisma.$on('error', (event) => {
    logger.logger.error(event)
})

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.use(cors({ origin: process.env.URL_FRONT }));
app.use('/files', express.static('files'));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}

const server: http.Server<any> = http.createServer(app);
ioServer.init(server);

logger.init();

/*-----------------------------------------Boot start Method--------------------------------------------*/
//boot.start() is a method that is called when the server is booting, 
//it is used for the website to function properly even after a rash restart

boot.start().then((): void => {
    languagesRouting.init(app);
    accountRouting.init(app);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        errorHandler.logErrorMiddleware(err, req, res, next);
    });

    if (server.listen(process.env.PORT || 8080)) {
        logger.logger.info('=========== SERVER STARTED FOR HTTP RQ ===========');
        logger.logger.info('    =============   PORT: 8080   =============');
    }
});