// @ts-ignore
import express, {Request, Response} from 'express';
// @ts-ignore
import bodyParser from 'body-parser';
// @ts-ignore
import cors from 'cors';
import * as dotenv from 'dotenv';
import EncryptRsa from 'encrypt-rsa';

import languagesRouting from './modules/languages/languagesRouting';
import accountBasicRouting from './modules/account/basic/accountBasicRouting';
import accountFriendsRouting from './modules/account/friends/accountFriendsRouting';
import accountNotificationRouting from './modules/account/notification/accountNotificationRouting';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:8100'}));
app.use('/files', express.static('files'));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}

languagesRouting.init(app);
accountBasicRouting.init(app);
accountFriendsRouting.init(app);
accountNotificationRouting.init();


if (app.listen(process.env.PORT || 8080)) {
    console.log('=========== SERVER STARTED FOR HTTP RQ ===========');
    console.log('    =============   PORT: 8080   =============');
}