//----------------------------------------Friends----------------------------------------
//Version 1.0.0
//This class is used to manage the friends of the user and their messages
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//---------------------------------------------------------------------------------------

import { Socket } from 'socket.io';
import { AccountNotification } from '../notification/accountNotification';
import ioServer from '../../common/socket/socket';
import accountFriendsRequest from './accountFriendsRequest';
import createClient, { Client } from 'edgedb';

export class AccountFriends{
    private accountNotification: AccountNotification;
    private client: Client;

    constructor(accountNotification : AccountNotification) {
        this.client = createClient({});
        this.accountNotification = accountNotification;
    }

    public async addFriend(socket : Socket, username : string) {
        
    }

    public async sendMessage(socket : Socket, username : string, message : string, date : Date) {
        const socketOfUsername = (await ioServer.io.fetchSockets()).find((socketTmp) => socketTmp.data.username === username);
        this.accountNotification.addNotifications(username, 'Nouveau message', message);
        
        const dateISO = new Date(date).toISOString()

        accountFriendsRequest.newMessage(socket.data.username, username, message, dateISO, this.client);

        if(socketOfUsername !== undefined) {
            ioServer.io.to(socketOfUsername.id).emit('message');
        }

        return
    }

    public async getMessage(socket : Socket) {
        const request = await accountFriendsRequest.getMessage(socket.data.username, this.client);

        socket.emit('getMessage', request);
        return
    }
}