// @ts-ignore
import express, {Request, Response} from 'express';
// @ts-ignore
import bodyParser from 'body-parser';
// @ts-ignore
import cors from 'cors';
import * as dotenv from 'dotenv';
import EncryptRsa from 'encrypt-rsa';

import languagesRouting from './modules/languages/languagesRouting';
import accountRouting from './modules/account/accountRouting';

const encryptRsa = new EncryptRsa();
const {publicKey, privateKey} = encryptRsa.createPrivateAndPublicKeys();
function decrypt(encryptedText: string)
{
    console.log('publicKey : ', publicKey);
    const decryptedText = encryptRsa.decryptStringWithRsaPrivateKey({
        text: encryptedText,
        privateKey
    });
    console.log('decrypted : ', decryptedText);
}

const encryptedText = encryptRsa.encryptStringWithRsaPublicKey({
    text: 'hello world',
    publicKey,
});

console.log('native publicKey : ', publicKey);

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:8100'}));
app.use('/files', express.static('files'));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}

accountRouting.init(app);
languagesRouting.init(app);

if (app.listen(process.env.PORT || 8080)) {
    console.log('=========== SERVER STARTED FOR HTTP RQ ===========');
    console.log('    =============   PORT: 8080   =============');
}

app.get('/getPublicKey', async function(req : Request, res : Response) {
    res.json({publicKey});
});

app.post('/test', async function(req : Request, res : Response) {
    decrypt(req.body.encryptedText);
    res.json({});
});