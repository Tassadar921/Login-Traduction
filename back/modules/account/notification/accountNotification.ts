import createClient, {Client} from 'edgedb';
import {Socket} from 'socket.io';
import AccountNotificationRequest from './accountNotificationRequest';

import ioServer from '../../socket/socket';

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
        if(!this.checkRegexUUID(id)) {
            return;
        }else {
            const data = await AccountNotificationRequest.notificationIsSeen(id, this.client);
            await this.synchronizeNotifications(socket);
            return;
        }
    }

    public async deleteNotification(socket : Socket, id : string) : Promise<void>{
        if(!this.checkRegexUUID(id)) {
            return;
        }else {
            await AccountNotificationRequest.deleteNotification(id, this.client);
            await this.synchronizeNotifications(socket);
            return;
        }
    }

    public async addNotifications(username : string, title : string, text : string) : Promise<void>{
        const socket = (await ioServer.io.fetchSockets()).find((socketTmp) => socketTmp.data.username === username);
        const date = new Date().toISOString()
        await AccountNotificationRequest.addNotifications(socket.data.token, title, text, date ,this.client);
        console.log("add");

        if (socket) {
            await this.synchronizeNotifications(socket);
        }
        return;
    }

    private checkRegexUUID(uuid : string) {
        return (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/).test(uuid);
    }
}