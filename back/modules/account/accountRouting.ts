//----------------------------------------accountRouting----------------------------------------
//Version 1.0.0 
//This module manages the routing for all the account module
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

import {Express, Request, Response} from 'express';
import * as socketIO from 'socket.io';

import socketOptions from '../common/socket/socketOptions';

import {AccountResetPassword} from './resetPassword/accountResetPassword';
import {AccountFriends} from './friends/accountFriends';
import {AccountNotification} from './notification/accountNotification';
import {AccountSignIn} from './signIn/accountSignIn';
import {AccountSignUp} from './signUp/accountSignUp';
import ioServer from 'modules/common/socket/socket';

module accountRouting {
    export function init(app: Express): void {


        initHttp(app);
        initSocket(ioServer.io);

        console.log('accountRouting initialized');
    }

    function initHttp(app: Express): void {
        const accountResetPassword = new AccountResetPassword();
        const accountSignIn = new AccountSignIn();
        const accountSignUp = new AccountSignUp();

        /*----------------------------------------SignUp----------------------------------------*/

        app.post('/signUp', async function (req: Request, res: Response) {
            await accountSignUp.createUserCreation(req.body.username, req.body.password, req.body.email, req.body.language, res);
        });
        app.post('/confirmSignUp', async function (req: Request, res: Response) {
            await accountSignUp.createUser(req.body.urlToken, res);
        });

        /*----------------------------------------Login----------------------------------------*/

        app.post('/signIn', async function (req: Request, res: Response) {
            await accountSignIn.signIn(req.body.identifier, req.body.password, res);
        });

        app.post('/signOut', async function (req: Request, res: Response) {
            await accountSignIn.signOut(req.body.username, req.body.sessionToken, res);
        });

        app.post('/checkSession', async function (req: Request, res: Response) {
            await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res);
        });

        /*----------------------------------------ResetPassword----------------------------------------*/

        app.post('/resetPassword', async function (req: Request, res: Response) {
            await accountResetPassword.mailResetPasswordCreateUrlToken(req.body.email, req.body.language, res);
        });
        app.post('/confirmResetPassword', async function (req: Request, res: Response) {
            await accountResetPassword.resetPassword(req.body.urlToken, req.body.password, res);
        });

        /*----------------------------------------Friends----------------------------------------*/

        app.post('/addFriend', async function (req: Request, res: Response) {

        });

        /*--------------------------------------Notification-------------------------------------*/


        app.post('/test', async function (req: Request, res: Response) {
            //code
            await res.json({status: 1});
        });

        return;
    }

    function initSocket(io: socketIO.Server<socketOptions.ClientToServerEvents, socketOptions.ServerToClientEvents, socketOptions.InterServerEvents, socketOptions.SocketData>): void {
        const accountNotification = new AccountNotification();
        const accountFriends = new AccountFriends(accountNotification);

        io.on('connection', (socket) => {
            console.log('-----new client-----')
            socket.emit('initSocketData');

            socket.on('initSocketData', async (username: string, token: string) => {
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