//----------------------------------------accountRouting----------------------------------------
//Version 1.0.0 
//This module manages the routing for all the account module
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

import {Express, NextFunction, Request, Response} from 'express';
import * as socketIO from 'socket.io';

import socketOptions from '../common/socket/socketOptions';

import {AccountResetPassword} from './resetPassword/accountResetPassword';
import {AccountFriends} from './friends/accountFriends';
import {AccountNotification} from './notification/accountNotification';
import {AccountSignIn} from './signIn/accountSignIn';
import {AccountSignUp} from './signUp/accountSignUp';
import ioServer from 'modules/common/socket/socket';
import logger from 'modules/common/logger/logger';

module accountRouting {
    export function init(app: Express): void {


        initHttp(app);
        initSocket(ioServer.io);

        logger.logger.info('accountRouting initialized');
    }

    function initHttp(app: Express): void {
        const accountResetPassword: AccountResetPassword = new AccountResetPassword();
        const accountSignIn: AccountSignIn = new AccountSignIn();
        const accountSignUp: AccountSignUp = new AccountSignUp();
        const accountFriends: AccountFriends = new AccountFriends(new AccountNotification());

        /*----------------------------------------SignUp----------------------------------------*/

        app.post('/signUp', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `signUp, { username : ${req.body.username}, email :  ${req.body.email}, language : ${req.body.language} }`
                );
                await accountSignUp.createUserCreation(req.body.username, req.body.password, req.body.email, req.body.language, res);
            } catch (error) {
                next(error);
            }
        });

        app.post('/confirmSignUp', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `confirmSignUp, { urlToken : ${req.body.urlToken} }`
                );
                await accountSignUp.createUser(req.body.urlToken, res);
            } catch (error) {
                next(error);
            }
        });

        /*----------------------------------------Login----------------------------------------*/

        app.post('/checkSession', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `checkSession, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken} }`
                );
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await res.json({status: 1});
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        app.post('/signIn', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `signIn, { identifier : ${req.body.identifier} }`
                );
                await accountSignIn.signIn(req.body.identifier, req.body.password, res);
            } catch (error) {
                next(error);
            }
        });


        app.post('/signOut', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `signOut, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken} }`
                );
                await accountSignIn.signOut(req.body.username, req.body.sessionToken, res);
            } catch (error) {
                next(error);
            }
        });

        /*----------------------------------------ResetPassword----------------------------------------*/

        app.post('/resetPassword', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `resetPassword, { email : ${req.body.email}, language : ${req.body.language} }`
                );
                await accountResetPassword.mailResetPasswordCreateUrlToken(req.body.email, req.body.language, res);
            } catch (error) {
                next(error);
            }
        });
        app.post('/confirmResetPassword', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `confirmResetPassword, { urlToken : ${req.body.urlToken} }`
                );
                await accountResetPassword.resetPassword(req.body.urlToken, req.body.password, res);
            } catch (error) {
                next(error);
            }
        });

        /*----------------------------------------Friends----------------------------------------*/

        app.post('/askIfNotAddFriend', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `askIfNotAddFriend, { senderUsername : ${req.body.senderUsername}, receiverUsername : ${req.body.receiverUsername}, sessionToken : ${req.body.sessionToken} }`
                );
                if(await accountSignIn.checkSession(req.body.senderUsername, req.body.sessionToken, res)){
                    await accountFriends.askIfNotAddFriend(req.body.senderUsername, req.body.receiverUsername, res);
                }else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        app.post('/getFriendUsers', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `getFriend, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken}, itemsPerPage : ${req.body.itemsPerPage}, page : ${req.body.page} }`
                );
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await accountFriends.getFriendUsers(req.body.username, req.body.itemsPerPage,  req.body.page, res);
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        app.post('/getFriendUsersNumber', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `getFriendUsersNumber, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken} }`
                );
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await accountFriends.getFriendUsersNumber(req.body.username, req.body.itemsPerPage,  req.body.page, res);
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        app.post('/getEnteringPendingFriendsRequests', async function (req: Request, res: Response, next : NextFunction): Promise<void> {

            try {
                logger.logger.info(
                    `getEnteringPendingFriendsRequests, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken}, itemsPerPage : ${req.body.itemsPerPage}, page : ${req.body.page} }`
                );
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await accountFriends.getEnteringPendingFriendsRequests(req.body.username, req.body.itemsPerPage,  req.body.page, res);
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        app.post('/getExitingPendingFriendsRequests', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `getExitingPendingFriendsRequests, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken}, itemsPerPage : ${req.body.itemsPerPage}, page : ${req.body.page} }`
                );
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await accountFriends.getExitingPendingFriendsRequests(req.body.username, req.body.itemsPerPage,  req.body.page, res);
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        app.post('/getOtherUsers', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `getOtherUsers, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken}, itemsPerPage : ${req.body.itemsPerPage}, page : ${req.body.page} }`
                );
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await accountFriends.getOtherUsers(req.body.username, req.body.itemsPerPage,  req.body.page, res);
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        app.post('/blockUser', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `blockUser, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken}, blockedUsername : ${req.body.blockedUsername} }`
                );
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await accountFriends.blockUser(req.body.username, req.body.blockedUsername, res);
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        app.post('/unblockUser', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `unblockUser, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken}, blockedUsername : ${req.body.blockedUsername} }`
                );
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await accountFriends.unblockUser(req.body.username, req.body.blockedUsername, res);
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        app.post('/getBlockedUsers', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `getBlockedUsers, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken}, itemsPerPage : ${req.body.itemsPerPage}, page : ${req.body.page} }`
                );
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await accountFriends.getBlockedUsers(req.body.username, req.body.itemsPerPage, req.body.page, res);
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        app.post('/getBlockedUsersNumber', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `getBlockedUsersNumber, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken} }`
                );
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await accountFriends.getBlockedUsersNumber(req.body.username, res);
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });



        app.post('/refuseFriendRequest', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `refuseFriendRequest, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken}, senderUsername : ${req.body.senderUsername} }`
                );
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await accountFriends.refuseFriendRequest(req.body.username, req.body.senderUsername, res);
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        app.post('/cancelFriendRequest', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `cancelFriendRequest, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken}, receiverUsername : ${req.body.receiverUsername} }`
                );
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await accountFriends.cancelFriendRequest(req.body.username, req.body.receiverUsername, res);
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        app.post('/removeFriend', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `cancelFriendRequest, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken}, receiverUsername : ${req.body.receiverUsername} }`
                );
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await accountFriends.removeFriend(req.body.username, req.body.receiverUsername, res);
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        app.post('/getOtherUsersNumber', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(
                    `getNumberOfOtherUsers, { username : ${req.body.username}, sessionToken : ${req.body.sessionToken} }`);
                if(await accountSignIn.checkSession(req.body.username, req.body.sessionToken, res)){
                    await accountFriends.getOthersUserNumber(req.body.username, res);
                }
                else{
                    await res.json({status: 0});
                }
            } catch (error) {
                next(error);
            }
        });

        /*--------------------------------------Notification-------------------------------------*/


        app.post('/test', async function (req: Request, res: Response, next : NextFunction): Promise<void> {
            try {
                logger.logger.info(`test, { message : ${req.body.message} }`);
                await res.json({status: 1});
            } catch (error) {
                next(error);
            }
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
            logger.logger.info('-----  New client connected    -----');
            socket.emit('initSocketData');

            socket.on('initSocketData', async (username: string, token: string): Promise<void> => {
                try {
                    logger.logger.info(`initSocketData, { username : ${username}, token : ${token}}`);
                    await accountNotification.initSocketData(socket, username, token);
                } catch (error) {
                    logger.logger.error(error);
                    socket.emit('error');
                }
            });

            /*------------------------------------Notification------------------------------------*/

            socket.on('synchronizeNotifications', async (): Promise<void> => {
                try {
                    logger.logger.info('synchronizeNotifications');
                    await accountNotification.synchronizeNotificationsWithSocket(socket);
                } catch (error) {
                    logger.logger.error(error);
                    socket.emit('error');
                }
            });
            socket.on('notificationIsSeen', async (id: string): Promise<void> => {
                try {
                    logger.logger.info(`notificationIsSeen, { id : ${id}}`);
                    await accountNotification.notificationIsSeen(socket, id);
                } catch (error) {
                    logger.logger.error(error);
                    socket.emit('error');
                }
            });
            socket.on('deleteNotification', async (id: string): Promise<void> => {
                try {
                    logger.logger.info(`deleteNotification, { id : ${id}}`);
                    await accountNotification.deleteNotification(socket, id);
                } catch (error) {
                    logger.logger.error(error);
                    socket.emit('error');
                }
            });

            /*----------------------------------------Chat----------------------------------------*/

            socket.on('getChat', async (): Promise<void> => {
                try {
                    logger.logger.info('getChat');
                    await accountFriends.getMessage(socket);
                } catch (error) {
                    logger.logger.error(error);
                    socket.emit('error');
                }
            });
            socket.on('sendMessage', async (username: string, message: string, date: Date): Promise<void> => {
                try {
                    logger.logger.info(`sendMessage, { username : ${username}, message : ${message}, date : ${date}}`);
                    await accountFriends.sendMessage(username, message, date, socket);
                } catch (error) {
                    logger.logger.error(error);
                    socket.emit('error');
                }
            });

            socket.on('disconnect', async (): Promise<void> => {
                logger.logger.info('client déconnecté');
            });
        });
        return;
    }
}

export default accountRouting;