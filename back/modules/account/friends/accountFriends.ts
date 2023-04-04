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
        //start by finding the socket if it exists else get undefined (if the user is not connected)
        const socketOfUsername = (await ioServer.io.fetchSockets()).find((socketTmp) => socketTmp.data.username === username);

        //convert the date to ISO format
        const dateISO = new Date(date).toISOString()

        //add the message to the database
        let dataMessage = await accountFriendsRequest.newMessage(socket.data.username, username, message, dateISO, this.client);

        if(dataMessage.length != undefined) {
            this.accountNotification.addNotificationsMessage(username, socket.data.username, dataMessage[0].id);
        }

        //if the socket exists send the message to the user
        if(socketOfUsername !== undefined) {
            ioServer.io.to(socketOfUsername.id).emit('message');
        }

        return
    }

    public async getMessage(socket : Socket) {
        //get the messages from the database
        const request = await accountFriendsRequest.getMessage(socket.data.username, this.client);

        socket.emit('getMessage', request);
        return
    }
}