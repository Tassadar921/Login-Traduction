import { Socket } from 'socket.io';
import { AccountNotification } from '../notification/accountNotification';
import ioServer from '../../socket/socket';
import accountFriendsRequest from './accountFriendsRequest';
import createClient, { Client } from 'edgedb';

export class AccountFriends{
    private accountNotification: AccountNotification;
    private client: any;
    constructor(accountNotification : AccountNotification) {
        this.client = createClient({});
        this.accountNotification = accountNotification;
    }

    public async sendMessage(socket : Socket, username : string, message : string, date : Date) {
        const toSocket = (await ioServer.io.fetchSockets()).find((socketTmp: Socket ) => socketTmp.data.username === username);
        this.accountNotification.addNotifications(username, 'Nouveau message', message);

        accountFriendsRequest.newMessage(socket.data.username, username, message, date, this.client);

        if(toSocket !== undefined) {
            ioServer.io.to(toSocket?.id!).emit('sendMessage', socket.data.username!, message, date);
        }
    }
}