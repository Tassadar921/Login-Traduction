import createClient, { Client } from 'edgedb';
import { uuid } from 'edgedb/dist/codecs/ifaces';
import { Socket } from 'socket.io';
import {AccountNotificationRequest } from './accountNotificationRequest';

export class AccountNotification{
    private readonly client: Client;
    
    constructor() {
        this.client = createClient({});
    }

    public async initSocketData(socket : Socket, username : string, token : string) : Promise<void>{
        socket.data.token = token;
        socket.data.username = username;
        console.log(username, 'is connected and his token is :',token);

        return;
    }

    public async synchronizeNotifications(socket : Socket) : Promise<void>{
        const data = await AccountNotificationRequest.getNotifications(socket.data.token, this.client);
        socket.emit('synchronizeNotifications', data);

        return;
    }

    public async notificationIsSeen(socket : Socket, id : string) : Promise<void>{
        const data = await AccountNotificationRequest.notificationIsSeen(id, this.client);

        return;
    }

    public async deleteNotification(socket : Socket, id : uuid) : Promise<void>{
        await AccountNotificationRequest.deleteNotification(id, this.client);

        return;
    }

    public async addNotifications(socket : Socket) : Promise<void>{
        const data = await AccountNotificationRequest.addNotifications(socket.data.token, this.client);
        socket.emit('emitNotif', data);
    }


}