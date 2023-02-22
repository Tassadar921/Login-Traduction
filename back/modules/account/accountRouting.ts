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

        console.log('accountRouting init');
    }

    function initHttp(app: Express): void {
        const account = new AccountBasic();
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
            if(req.body.publicKey!==publicKey) {
                await res.json({status: -3});
            } else {
                await account.mailSignUp(req.body.username, decrypt(req.body.password), req.body.email, req.body.language, res);
            }
        });
        app.post('/createAccount', async function (req: Request, res: Response) {
            await account.createAccount(req.body.urlToken, res);
        });
        app.post('/signIn', async function (req: Request, res: Response) {
            await account.signIn(req.body.identifier, req.body.password, res);
        });
        app.post('/mailResetPassword', async function (req: Request, res: Response) {
            await account.mailResetPasswordCreateUrlToken(req.body.email, req.body.language, res);
        });
        app.post('/resetPassword', async function (req: Request, res: Response) {
            await account.resetPassword(req.body.urlToken, req.body.password, res);
        });
        app.post('/fastCheck', async function (req: Request, res: Response) {
            await account.fastCheck(req.body.username, req.body.token, res);
        });

        return;
    }

    function initSocket(io : socketIO.Server<socketOptions.ClientToServerEvents, socketOptions.ServerToClientEvents, socketOptions.InterServerEvents, socketOptions.SocketData>) : void {
        const accountNotification = new AccountNotification();

        io.on('connection', (socket) => {
            console.log('-----new client-----')
            socket.on('initSocketData', (username : string, token : string) => {
                accountNotification.initSocketData(socket, username, token);
            });

//            socket.emit('emitNotif', [{name : "test", text : "test", date : new Date()}]);          
            socket.on('synchronizeNotifications', () => {
                accountNotification.synchronizeNotifications(socket);
            });
            socket.on('notificationIsSeen', (id) => {
                accountNotification.notificationIsSeen(socket, id);
            });
            socket.on('deleteNotification', (id) => {
                accountNotification.deleteNotification(socket, id);
            });




            socket.on('disconnect', () => {
                console.log('client déconnecté')
            });
        });

        return;
    }
}

export default accountRouting;