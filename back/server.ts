import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';

import http from 'http';

import boot from './modules/boot/boot';

import accountRouting from './modules/account/accountRouting';
import languagesRouting from './modules/languages/languagesRouting';
import ioServer from './modules/common/socket/socket';
import { initialize } from 'esbuild';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:8100'}));
app.use('/files', express.static('files'));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}

const server = http.createServer(app);

ioServer.init(server)

/*-----------------------------------------Boot start Method--------------------------------------------*/
//boot.start() is a method that is called when the server is booting, 
//it is used for the website to function properly even after a rash restart

boot.start().then(() => {
    languagesRouting.init(app);
    accountRouting.init(app);
    
    if (server.listen(process.env.PORT || 8080)) {
        console.log('=========== SERVER STARTED FOR HTTP RQ ===========');
        console.log('    =============   PORT: 8080   =============');
    }
});
