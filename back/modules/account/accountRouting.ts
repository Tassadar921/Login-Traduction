import {Express, Request, Response} from "express";
import EncryptRsa from "encrypt-rsa";
import * as socketIO from "socket.io";

import socketOptions from "../socket/socketOptions";

import { AccountBasic } from "./basic/accountBasic";
import { AccountFriends } from "./friends/accountFriends";
import { AccountNotification } from "./notification/accountNotification";

module accountRouting {
    export function init(app: Express, io : socketIO.Server<socketOptions.ClientToServerEvents, socketOptions.ServerToClientEvents, socketOptions.InterServerEvents, socketOptions.SocketData>): void {
        initHttp(app);
        initSocket(io);

        console.log('accountRouting initialized');
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

        /*----------------------------------------Basic----------------------------------------*/
        
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
            if(req.body.publicKey!==publicKey) {
                await res.json({status: -1});
            } else {
                await account.resetPassword(req.body.urlToken, decrypt(req.body.password), res);
            }
        });
        app.post('/checkSession', async function (req: Request, res: Response) {
            await account.checkSession(req.body.username, req.body.token, res);
        });

        /*----------------------------------------Friends----------------------------------------*/

        app.post('/addFriend', async function (req: Request, res: Response) {
            
        });

        /*----------------------------------------Notification----------------------------------------*/



        return;
    }

    function initSocket(io : socketIO.Server<socketOptions.ClientToServerEvents, socketOptions.ServerToClientEvents, socketOptions.InterServerEvents, socketOptions.SocketData>) : void {
        const accountNotification = new AccountNotification();
        const accountFriends = new AccountFriends(accountNotification);

        io.on('connection', (socket) => {
            console.log('-----new client-----')
            socket.emit('initSocketData');

            socket.on('initSocketData', async (username : string, token : string) => {
                await accountNotification.initSocketData(socket, username, token);
            });

            /*------------------------------------Notification------------------------------------*/
            socket.on('synchronizeNotifications', async () => {
                await accountNotification.synchronizeNotificationsWithSocket(socket);
            });
            socket.on('notificationIsSeen', async (id) => {
                await accountNotification.notificationIsSeen(socket, id);
            });
            socket.on('deleteNotification', async (id) => {
                await accountNotification.deleteNotification(socket, id);
            });
            socket.on('addNotifications', async (username, title, text) => {
                await accountNotification.addNotifications(username, title, text);
            });

            /*----------------------------------------Chat----------------------------------------*/
            socket.on('getChat', async () => {
                await accountFriends.getMessage(socket);                
            });
            socket.on('sendMessage', async (username, message, date) => {
                await accountFriends.sendMessage(socket, username, message, date);
            });

            socket.on('disconnect', async () => {
                console.log('client déconnecté')
            });
        });

        return;
    }
}

export default accountRouting;