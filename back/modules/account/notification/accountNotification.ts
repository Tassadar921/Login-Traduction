//----------------------------------------Notification----------------------------------------
//Version 1.0.0 
//This class is used to manage the notifications of the user
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//1.1.0 - 25/04/2023 - Iémélian RAMBEAU - New version of the notification type in the database, the functions are now adapted to the new database
//--------------------------------------------------------------------------------------------

import createClient, {Client} from 'edgedb';
import {RemoteSocket, Socket} from 'socket.io';
import AccountNotificationRequest from './accountNotificationRequest';
import socketOptions from 'modules/common/socket/socketOptions';

import ioServer from '../../common/socket/socket';
import regexRequest from 'modules/common/regex/regexRequest';
import {DefaultEventsMap} from 'socket.io/dist/typed-events';
import logger from 'modules/common/logger/logger';

export class AccountNotification {
    private readonly client: Client;

    constructor() {
        this.client = createClient({});
    }

    //initialise the socket data after the connection
    public async initSocketData(socket: Socket, username: string, sessionToken: string): Promise<void> {
        socket.data.sessionToken = sessionToken;
        socket.data.username = username;

        logger.logger.info(`${socket.data.username} is connected and his token is ${socket.data.sessionToken}`);
        return;
    }

    //gets the notifications from the database for the user
    public async synchronizeNotificationsWithSocket(socket: Socket): Promise<void> {
        const dataNotification : any[] = await AccountNotificationRequest.getNotifications(socket.data.sessionToken, this.client);
        socket.emit('synchronizeNotifications', dataNotification);

        return;
    }

    //gets the notifications from the database and sends it to a specific user (socket)
    private async synchronizeNotificationsWithRemoteSocket(socket: RemoteSocket<socketOptions.ServerToClientEvents, socketOptions.SocketData>): Promise<void> {
        const dataNotification : any[] = await AccountNotificationRequest.getNotifications(socket.data.sessionToken, this.client);
        socket.emit('synchronizeNotifications', dataNotification);

        return;
    }

    //sets the notification to seen
    public async notificationIsSeen(socket: Socket, id: string): Promise<void> {
        if (!regexRequest.checkRegexUUID(id)) {
            return;
        } else {
            await AccountNotificationRequest.notificationIsSeen(id, this.client);
            await this.synchronizeNotificationsWithSocket(socket);
            return;
        }
    }

    public async deleteNotification(socket: Socket, id: string): Promise<void> {
        //verify that the uuid is syntactically correct
        if (!regexRequest.checkRegexUUID(id)) {
            return;
        } else {
            //delete the notification
            await AccountNotificationRequest.deleteNotification(id, this.client);
            await this.synchronizeNotificationsWithSocket(socket);
            return;
        }
    }

    public async addNotificationMessage(username: string, idMessage: string): Promise<void> {
        //start by finding the socket if it exists else get undefined (if the user is not connected)
        const socketOfUsername: RemoteSocket<DefaultEventsMap, any> | undefined = await this.findSocketOfUsername(username);

        //convert the date to ISO format
        const date : string = new Date().toISOString();

        //add the notification to the database
        await AccountNotificationRequest.addNotificationMessage(username, 'message', date, idMessage, this.client);

        //if the user is connected, synchronize the notifications with the socket
        //if he's not connected, do nothing for the moment
        if (socketOfUsername !== undefined) {
            await this.synchronizeNotificationsWithRemoteSocket(socketOfUsername);
        }else{
            //offline notification
            logger.logger.info(`User ${username} is not connected`);
        }
        return;
    }

    public async addNotificationAskFriend(username: string, idMessage: string): Promise<void> {
        //start by finding the socket if it exists else get undefined (if the user is not connected)
        const socketOfUsername: RemoteSocket<DefaultEventsMap, any> | undefined = await this.findSocketOfUsername(username);

        //convert the date to ISO format
        const date: string = new Date().toISOString();

        //add the notification to the database
        await AccountNotificationRequest.addNotificationAskFriend(username, 'addFriend', date, idMessage, this.client);

        //if the user is connected, synchronize the notifications with the socket
        //if he's not connected, do nothing for the moment
        if (socketOfUsername !== undefined) {
            await this.synchronizeNotificationsWithRemoteSocket(socketOfUsername);
        }else{
            //offline notification
            logger.logger.info(`User ${username} is not connected`);
        }
        return;
    }

    public async findSocketOfUsername(username: string): Promise<RemoteSocket<DefaultEventsMap, any> | undefined> {
        //find the socket of the user if he is connected
        return (await(ioServer.io.fetchSockets())).find(
                (socketTmp: RemoteSocket<DefaultEventsMap, any>): boolean =>
                    socketTmp.data.username === username
            );
    }
}