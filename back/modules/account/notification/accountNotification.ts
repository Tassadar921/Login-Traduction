//----------------------------------------Notification----------------------------------------
//Version 1.0.0 
//This class is used to manage the notifications of the user
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------------

import createClient, {Client} from 'edgedb';
import {RemoteSocket, Socket} from 'socket.io';
import AccountNotificationRequest from './accountNotificationRequest';
import socketOptions from 'modules/common/socket/socketOptions';

import ioServer from '../../common/socket/socket';
import regexRequest from 'modules/common/regex/regexRequest';

export class AccountNotification{
    private readonly client: Client;
    
    constructor() {
        this.client = createClient({});
    }

    public async initSocketData(socket : Socket, username : string, token : string) : Promise<void>{
        //initialise the socket data after the connection
        socket.data.sessionToken = token;
        socket.data.username = username;
        console.log(socket.data.username, 'is connected and his token is :',socket.data.sessionToken);
        return;
    }

    public async synchronizeNotificationsWithSocket(socket : Socket) : Promise<void>{
        //get the notifications from the database for the user
        const dataNotification = await AccountNotificationRequest.getNotifications(socket.data.sessionToken, this.client);
        
        socket.emit('synchronizeNotifications', dataNotification);
        return;
    }

    private async synchronizeNotificationsWithRemoteSocket(socket : RemoteSocket<socketOptions.ServerToClientEvents, socketOptions.SocketData>) : Promise<void>{
        //get the notifications from the database and send it to a specific user (remoteSocket)
        const dataNotification = await AccountNotificationRequest.getNotifications(socket.data.sessionToken, this.client);

        socket.emit('synchronizeNotifications', dataNotification);
        return;
    }

    public async notificationIsSeen(socket : Socket, id : string) : Promise<void>{
        //verify that the uuid is syntactically correct
        if(!regexRequest.checkRegexUUID(id)) {
            return;
        }else {
            //set the notification to seen
            await AccountNotificationRequest.notificationIsSeen(id, this.client);
            await this.synchronizeNotificationsWithSocket(socket);
            return;
        }
    }

    public async deleteNotification(socket : Socket, id : string) : Promise<void>{
        //verify that the uuid is syntactically correct
        if(!regexRequest.checkRegexUUID(id)) {
            return;
        }else {
            //delete the notification
            await AccountNotificationRequest.deleteNotification(id, this.client);
            await this.synchronizeNotificationsWithSocket(socket);
            return;
        }
    }

    public async addNotificationsMessage(username : string, usernameSender : string, idMessage : string) : Promise<void>{
        //start by finding the socket if it exists else get undefined (if the user is not connected)
        const socketOfUsername = (await ioServer.io.fetchSockets()).find((socketTmp ) => socketTmp.data.username === username);

        //convert the date to ISO format
        const date = new Date().toISOString();

        //add the notification to the database
        await AccountNotificationRequest.addNotificationsMessage(username, "message", date, idMessage ,this.client);

        //if the user is connected, synchronize the notifications with the socket
        if(socketOfUsername !== undefined) {
            await this.synchronizeNotificationsWithRemoteSocket(socketOfUsername);
        }
        return;
    }
}