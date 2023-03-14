import {Express, Request, Response} from "express";
import EncryptRsa from "encrypt-rsa";
import * as socketIO from "socket.io";

import socketOptions from "../common/socket/socketOptions";

import { AccountResetPassword } from "./resetPassword/accountResetPassword";
import { AccountFriends } from "./friends/accountFriends";
import { AccountNotification } from "./notification/accountNotification";
import { AccountSignIn } from "./signIn/accountSignIn";
import { AccountSignUp } from "./signUp/accountSignUp";

module accountRouting {
    export function init(app: Express, io : socketIO.Server<socketOptions.ClientToServerEvents, socketOptions.ServerToClientEvents, socketOptions.InterServerEvents, socketOptions.SocketData>): void {
        initHttp(app);
        initSocket(io);

        console.log('accountRouting initialized');
    }

    function initHttp(app: Express): void {
        const accountResetPassword = new AccountResetPassword();
        const accountSignIn = new AccountSignIn();
        const accountSignUp = new AccountSignUp();
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

        /*----------------------------------------SignUp----------------------------------------*/

        app.post('/signUp', async function (req: Request, res: Response) {
            if(req.body.publicKey!==publicKey) {
                await res.json({status: -3});
            } else {
                await accountSignUp.createUserCreation(req.body.username, decrypt(req.body.password), req.body.email, req.body.language, res);
            }
        });
        app.post('/confirmSignUp', async function (req: Request, res: Response) {
            await accountSignUp.createUser(req.body.urlToken, res);
        });        

        /*----------------------------------------Login----------------------------------------*/

        app.post('/signIn', async function (req: Request, res: Response) {
            await accountSignIn.signIn(req.body.identifier, req.body.password, res);
        });

        app.post('/signOut', async function (req: Request, res: Response) {
            await accountSignIn.signOut(req.body.username, req.body.token, res);
        });

        app.post('/checkSession', async function (req: Request, res: Response) {
            await accountSignIn.checkSession(req.body.username, req.body.token, res);
        });

        /*----------------------------------------ResetPassword----------------------------------------*/

        app.post('/resetPassword', async function (req: Request, res: Response) {
            await accountResetPassword.mailResetPasswordCreateUrlToken(req.body.email, req.body.language, res);
        });
        app.post('/confirmResetPassword', async function (req: Request, res: Response) {
            if(req.body.publicKey!==publicKey) {
                await res.json({status: -1});
            } else {
                await accountResetPassword.resetPassword(req.body.urlToken, decrypt(req.body.password), res);
            }
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