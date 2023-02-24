// @ts-ignore
import express from 'express';
// @ts-ignore
import bodyParser from 'body-parser';
// @ts-ignore
import cors from 'cors';
import * as dotenv from 'dotenv';

import http from 'http';

import accountRouting from './modules/account/accountRouting';
import languagesRouting from './modules/languages/languagesRouting';
import ioServer from './modules/socket/socket';

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

const io = ioServer.io;

languagesRouting.init(app);
accountRouting.init(app,io);

if (server.listen(process.env.PORT || 8080)) {
    console.log('=========== SERVER STARTED FOR HTTP RQ ===========');
    console.log('    =============   PORT: 8080   =============');
}