//----------------------------------------Friends----------------------------------------
//Version 1.0.0
//This class is used to manage the friends of the user and their messages
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//---------------------------------------------------------------------------------------

import {RemoteSocket, Socket} from 'socket.io';
import { AccountNotification } from '../notification/accountNotification';
import ioServer from '../../common/socket/socket';
import accountFriendsRequest from './accountFriendsRequest';
import createClient, { Client } from 'edgedb';
import {DefaultEventsMap} from 'socket.io/dist/typed-events';

export class AccountFriends{
    private accountNotification: AccountNotification;
    private readonly client: Client;

    constructor(accountNotification : AccountNotification) {
        this.client = createClient({});
        this.accountNotification = accountNotification;
    }

    public async addFriend(socket : Socket, username : string): Promise<void> {
        
    }

    public async sendMessage(socket : Socket, username : string, message : string, date : Date): Promise<void> {
        //start by finding the socket if it exists else get undefined (if the user is not connected)
        const socketOfUsername: RemoteSocket<DefaultEventsMap, any> | undefined  =
            (await ioServer.io.fetchSockets()).find(
                (socketTmp: RemoteSocket<DefaultEventsMap, any>): boolean => socketTmp.data.username === username
            );

        //convert the date to ISO format
        const dateISO = new Date(date).toISOString()

        //add the message to the database
        let dataMessage: any[] = await accountFriendsRequest.newMessage(socket.data.username, username, message, dateISO, this.client);

        if(dataMessage.length != undefined) {
            await this.accountNotification.addNotificationsMessage(username, socket.data.username, dataMessage[0].id);
        }

        //if the socket exists send the message to the user
        if(socketOfUsername !== undefined) {
            ioServer.io.to(socketOfUsername.id).emit('message');
        }

        return
    }

    public async getMessage(socket : Socket): Promise<void> {
        //get the messages from the database
        const request: any[] = await accountFriendsRequest.getMessage(socket.data.username, this.client);

        socket.emit('getMessage', request);
        return
    }
}