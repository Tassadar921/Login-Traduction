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
        const accountResetPassword: AccountResetPassword = new AccountResetPassword();
        const accountSignIn: AccountSignIn = new AccountSignIn();
        const accountSignUp: AccountSignUp = new AccountSignUp();
        const accountFriends: AccountFriends = new AccountFriends(new AccountNotification());

        /*----------------------------------------SignUp----------------------------------------*/

        app.post('/signUp', async function (req: Request, res: Response): Promise<void> {
            await accountSignUp.createUserCreation(req.body.username, req.body.password, req.body.email, req.body.language, res);
        });
        app.post('/confirmSignUp', async function (req: Request, res: Response): Promise<void> {
            await accountSignUp.createUser(req.body.urlToken, res);
        });

        /*----------------------------------------Login----------------------------------------*/

        app.post('/checkSession', async function (req: Request, res: Response): Promise<void> {
            if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                await res.json({status: 1});
            }
            else{
                await res.json({status: 0});
            }
        });

        app.post('/signIn', async function (req: Request, res: Response): Promise<void> {
            await accountSignIn.signIn(req.body.identifier, req.body.password, res);
        });

        app.post('/signOut', async function (req: Request, res: Response): Promise<void> {
            await accountSignIn.signOut(req.body.username, req.body.sessionToken, res);
        });

        /*----------------------------------------ResetPassword----------------------------------------*/

        app.post('/resetPassword', async function (req: Request, res: Response): Promise<void> {
            await accountResetPassword.mailResetPasswordCreateUrlToken(req.body.email, req.body.language, res);
        });
        app.post('/confirmResetPassword', async function (req: Request, res: Response): Promise<void> {
            await accountResetPassword.resetPassword(req.body.urlToken, req.body.password, res);
        });

        /*----------------------------------------Friends----------------------------------------*/

        app.post('/askFriend', async function (req: Request, res: Response): Promise<void> {
            if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                await accountFriends.askFriend(req.body.username, res);
            }else{
                await res.json({status: 0});
            }
        });

        app.post('/getFriends', async function (req: Request, res: Response): Promise<void> {
            if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                await accountFriends.getFriends(req.body.username, req.body.itemsPerPage,  req.body.page, res);
            }
            else{
                await res.json({status: 0});
            }
        });

        app.post('/getEnteringPendingFriendsRequests', async function (req: Request, res: Response): Promise<void> {
            if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                await accountFriends.getEnteringPendingFriendsRequests(req.body.username, req.body.itemsPerPage,  req.body.page, res);
            }
            else{
                await res.json({status: 0});
            }
        });

        app.post('/getExitingPendingFriendsRequests', async function (req: Request, res: Response): Promise<void> {
            if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                await accountFriends.getExitingPendingFriendsRequests(req.body.username, req.body.itemsPerPage,  req.body.page, res);
            }
            else{
                await res.json({status: 0});
            }
        });

        /*--------------------------------------Notification-------------------------------------*/


        app.post('/test', async function (req: Request, res: Response): Promise<void> {
            //code
            await res.json({status: 1});
        });

        return;
    }

    function initSocket(io: socketIO.Server<socketOptions.ClientToServerEvents,
        socketOptions.ServerToClientEvents,
        socketOptions.InterServerEvents,
        socketOptions.SocketData>): void {
        const accountNotification: AccountNotification = new AccountNotification();
        const accountFriends: AccountFriends = new AccountFriends(accountNotification);

        io.on('connection', (socket: socketIO.Socket<any>): void => {
            console.log('-----  New client connected    -----')
            socket.emit('initSocketData');

            socket.on('initSocketData', async (username: string, token: string): Promise<void> => {
                await accountNotification.initSocketData(socket, username, token);
            });

            /*------------------------------------Notification------------------------------------*/

            socket.on('synchronizeNotifications', async (): Promise<void> => {
                await accountNotification.synchronizeNotificationsWithSocket(socket);
            });
            socket.on('notificationIsSeen', async (id: string): Promise<void> => {
                await accountNotification.notificationIsSeen(socket, id);
            });
            socket.on('deleteNotification', async (id: string): Promise<void> => {
                await accountNotification.deleteNotification(socket, id);
            });

            /*----------------------------------------Chat----------------------------------------*/

            socket.on('getChat', async (): Promise<void> => {
                await accountFriends.getMessage(socket);
            });
            socket.on('sendMessage', async (username: string, message: string, date: Date): Promise<void> => {
                await accountFriends.sendMessage(username, message, date, socket);
            });

            socket.on('disconnect', async (): Promise<void> => {
                console.log('client déconnecté')
            });
        });

        return;
    }
}

export default accountRouting;