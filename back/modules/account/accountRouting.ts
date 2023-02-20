import {Express, Request, Response} from "express";
import EncryptRsa from "encrypt-rsa";
import * as socketIO from "socket.io";

import socketOptions from "../socketOptions/socketOptions";

import { AccountBasic } from "./basic/accountBasic";
import { AccountFriends } from "./friends/accountFriends";
import { AccountNotification } from "./notification/accountNotification";

module accountRouting {
    export function init(app: Express, io : socketIO.Server<socketOptions.ClientToServerEvents, socketOptions.ServerToClientEvents, socketOptions.InterServerEvents, socketOptions.SocketData>): void {
        initHttp(app);
        initSocket(io);
    }

    function initHttp(app: Express): void {
        const accountBasic = new AccountBasic();
        const encryptRsa = new EncryptRsa();
        const {publicKey, privateKey} = encryptRsa.createPrivateAndPublicKeys();

        function decrypt(encryptedText: string) {
            return encryptRsa.decryptStringWithRsaPrivateKey({
                text: encryptedText,
                privateKey
            });
        }

        app.get('/getPublicKey', async function (req: Request, res: Response) {
            await res.json({publicKey});
        });
        app.post('/mailSignUp', async function (req: Request, res: Response) {
            await accountBasic.mailSignUp(req.body.username, decrypt(req.body.password), req.body.email, req.body.language, res);
        });
        app.post('/createAccount', async function (req: Request, res: Response) {
            await accountBasic.createAccount(req.body.urlToken, res);
        });
        app.post('/signIn', async function (req: Request, res: Response) {
            await accountBasic.signIn(req.body.identifier, req.body.password, res);
        });
        app.post('/mailResetPassword', async function (req: Request, res: Response) {
            await accountBasic.mailResetPasswordCreateUrlToken(req.body.email, req.body.language, res);
        });
        app.post('/resetPassword', async function (req: Request, res: Response) {
            await accountBasic.resetPassword(req.body.urlToken, req.body.password, res);
        });
        app.post('/fastCheck', async function (req: Request, res: Response) {
            await accountBasic.fastCheck(req.body.username, req.body.token, res);
        });

        console.log('accountBasic routing initialized');
        return;
    }

    function initSocket(io : socketIO.Server<socketOptions.ClientToServerEvents, socketOptions.ServerToClientEvents, socketOptions.InterServerEvents, socketOptions.SocketData>) {
        io.on('connection', (socket) => {
//            socket.emit('emitNotif', [{name : "test", text : "test", date : new Date()}]);          
            socket.on('delete', () => {
                
            });
            socket.on('disconnect', () => {
                
            });
        });

        return;
    }
}

export default accountRouting;