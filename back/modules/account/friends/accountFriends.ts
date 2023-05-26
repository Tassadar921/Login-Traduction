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
import {Response} from 'express';
import accountNotificationRequest from '../notification/accountNotificationRequest';

export class AccountFriends{
    private accountNotification: AccountNotification;
    private readonly client: Client;

    constructor(accountNotification : AccountNotification) {
        this.client = createClient({});
        this.accountNotification = accountNotification;
    }

    public async getOthersUserNumber(username: string, res: Response): Promise<void> {
        const numberOfOtherUsers: Array<unknown> = await accountFriendsRequest.getOtherUsersNumber(username, this.client);
        res.json({ status:1, data: numberOfOtherUsers[0] });
    }

    public async cancelFriendRequest(username: string, usernameReceiver: string, res: Response): Promise<void> {
        if (username === usernameReceiver) {
            res.json({ status: -1 });
            return;
        } else if (await accountFriendsRequest.getUserByUsername(usernameReceiver, this.client) === undefined) {
            res.json({ status: -2 });
            return;
        } else {
            await accountFriendsRequest.removePendingFriendsRequests(username, usernameReceiver, this.client);
            await this.updateDisplay(usernameReceiver, 'AddComponent');
            res.json({ status: 1 });
        }
    }

    public async refuseFriendRequest(username: string, usernameSender: string, res: Response): Promise<void> {
        if (usernameSender === username) {
            res.json({ status: -1 });
            return;
        } else if (await accountFriendsRequest.getUserByUsername(usernameSender, this.client) === undefined) {
            res.json({ status: -2 });
            return;
        } else {
            await accountFriendsRequest.removePendingFriendsRequests(usernameSender, username, this.client);
            await this.updateDisplay(usernameSender, 'AddComponent');
            res.json({ status: 1 });
            return;
        }
    }

    public async blockUserIntermediary(usernameSender: string, usernameReceiver: string, enteringAddFriendNotifId: string, exitingAddFriendNotifId: string, res: Response): Promise<void> {
        if (usernameSender === usernameReceiver) {
            res.json({ status: -1 });
            return;
        } else if (await accountFriendsRequest.getUserByUsername(usernameReceiver, this.client) === undefined) {
            res.json({ status: -2 });
            return;
        } else if ((await accountFriendsRequest.getFriendByBothUsernames(usernameSender, usernameReceiver, this.client)).length) {
            await accountFriendsRequest.removeFriend(usernameSender, usernameReceiver, this.client);
            await accountFriendsRequest.removeFriend(usernameReceiver, usernameSender, this.client);
            await this.blockUser(usernameSender, usernameReceiver, res);
            return;
        } else if((await accountFriendsRequest.getPendingFriendsRequestByBothUsernames(usernameSender, usernameReceiver, this.client)).length){
            await accountFriendsRequest.removePendingFriendsRequests(usernameReceiver, usernameSender, this.client);
            await accountNotificationRequest.deleteNotification(enteringAddFriendNotifId, this.client);
            await this.blockUser(usernameSender, usernameReceiver, res);
            return;
        } else if((await accountFriendsRequest.getPendingFriendsRequestByBothUsernames(usernameReceiver, usernameSender, this.client)).length) {
            await accountFriendsRequest.removePendingFriendsRequests(usernameSender, usernameReceiver, this.client);
            await accountNotificationRequest.deleteNotification(exitingAddFriendNotifId, this.client);
            await this.blockUser(usernameSender, usernameReceiver, res);
            return;
        } else {
            await this.blockUser(usernameSender, usernameReceiver, res);
            return;
        }
    }

    private async blockUser(usernameSender: string, usernameReceiver: string, res: Response): Promise<void> {
        await accountFriendsRequest.addBlockedUser(usernameSender, usernameReceiver, this.client);
        await accountFriendsRequest.addBlockedBy(usernameSender, usernameReceiver, this.client);
        await this.updateDisplay(usernameSender, 'AddComponent');
        await this.updateDisplay(usernameReceiver, 'AddComponent');
        res.json({ status: 1 });
    }

    public async getBlockedUsers(username: string, itemsPerPage: number, page: number, filter: string, res: Response): Promise<void> {
        const blockedUsers: Array<unknown> = await accountFriendsRequest.getBlockedUsers(username, itemsPerPage, page, filter, this.client);
        res.json({ status: 1, data: blockedUsers });
    }

    public async getBlockedUsersNumber(username: string, res: Response): Promise<void> {
        const blockedUsersNumber: Array<unknown> = await accountFriendsRequest.getBlockedUsersNumber(username, this.client);
        res.json({ status:1, data: blockedUsersNumber[0] });
    }

    public async removeFriend(usernameSender: string, usernameReceiver: string, res: Response): Promise<void> {
        if (usernameSender === usernameReceiver) {
            res.json({ status: -1 });
            return;
        } else if (await accountFriendsRequest.getUserByUsername(usernameReceiver, this.client) === undefined) {
            res.json({ status: -2 });
            return;
        } else if ((await accountFriendsRequest.getFriendByBothUsernames(usernameSender, usernameReceiver, this.client)).length) {
            await accountFriendsRequest.removeFriend(usernameSender, usernameReceiver, this.client);
            await accountFriendsRequest.removeFriend(usernameReceiver, usernameSender, this.client);
            await this.updateDisplay(usernameSender, 'AddComponent');
            await this.updateDisplay(usernameReceiver, 'AddComponent');
            console.log('ici')
            res.json({ status: 1 });
            return;
        } else {
            res.json({ status: 0 });
            return;
        }
    }

    public async unblockUser(usernameSender: string, usernameReceiver: string, res: Response): Promise<void> {
        if (usernameSender === usernameReceiver) {
            res.json({ status: -1 });
            return;
        } else if (await accountFriendsRequest.getUserByUsername(usernameReceiver, this.client) === undefined) {
            res.json({ status: -2 });
            return;
        } else if (await accountFriendsRequest.getBlockedUserByBothUsernames(usernameSender, usernameReceiver, this.client)) {
            await accountFriendsRequest.removeBlockedUser(usernameSender, usernameReceiver, this.client);
            await accountFriendsRequest.removeBlockedBy(usernameReceiver, usernameSender, this.client);
            await this.updateDisplay(usernameReceiver, 'AddComponent');
            await this.updateDisplay(usernameSender, 'BlockedComponent');
            res.json({ status: 1 });
            return;
        } else {
            res.json({ status: 0 });
            return;
        }
    }

    public async askIfNotAddFriend(usernameSender: string, usernameReceiver: string, res: Response): Promise<void> {
        if (usernameSender === usernameReceiver) {
            res.json({ status: -1 });
            return;
        } else if (await accountFriendsRequest.getUserByUsername(usernameReceiver, this.client) === undefined) {
            res.json({ status: -2 });
            return;
        } else if ((await accountFriendsRequest.getBlockedUserByBothUsernames(usernameSender, usernameReceiver, this.client)).length) {
            res.json({ status: -3 });
            return;
        } else if ((await accountFriendsRequest.getBlockedByByBothUsernames(usernameReceiver, usernameSender, this.client)).length) {
            res.json({ status: -4 });
            return;
        } else if ((await accountFriendsRequest.getFriendByBothUsernames(usernameSender, usernameReceiver, this.client)).length) {
            res.json({ status: 0 });
            return;
        } else if((await accountFriendsRequest.getPendingFriendsRequestByBothUsernames(usernameSender, usernameReceiver, this.client)).length){
            await accountFriendsRequest.removePendingFriendsRequests(usernameReceiver, usernameSender, this.client);
            await accountFriendsRequest.addFriend(usernameSender, usernameReceiver, this.client);
            await accountFriendsRequest.addFriend(usernameReceiver, usernameSender, this.client);
            await this.updateDisplay(usernameSender, 'AddComponent');
            await this.updateDisplay(usernameReceiver, 'AddComponent');
            res.json({ status: 10 });
            return;
        } else {
            await accountFriendsRequest.addPendingFriendsRequests(usernameSender, usernameReceiver, this.client);
            await this.accountNotification.addNotificationAskFriend(usernameReceiver, usernameSender);
            await this.updateDisplay(usernameSender, 'AddComponent');
            await this.updateDisplay(usernameReceiver, 'AddComponent');
            res.json({ status: 11 });
            return;
        }
    }

    public async getFriendUsers(username: string, itemsPerPage: number, page: number, filter: string, res: Response): Promise<void> {
        const friends: any[] = await accountFriendsRequest.getFriendUsers(username, itemsPerPage, page, filter, this.client);
        for(const friend of friends){
            if(await this.accountNotification.findSocketOfUsername(friend.username)){
                friend.online = true;
            }
        }
        res.json({ status: 1, data: friends });
        return;
    }

    public async getFriendUsersNumber(username: string, itemsPerPage: number, page: number, res: Response): Promise<void> {
        const friends: any[] = await accountFriendsRequest.getFriendUsersNumber(username, this.client);
        res.json({ status: 1, data: friends[0] });
        return;
    }

    public async getEnteringPendingFriendsRequests(username: string, itemsPerPage: number, page: number, res: Response): Promise<void> {
        const pendingFriendsRequests: any[] = await accountFriendsRequest.getEnteringPendingFriendsRequests(username, itemsPerPage, page, this.client);
        res.json({ status: 1, data: pendingFriendsRequests });
        return;
    }

    public async getExitingPendingFriendsRequests(username: string, itemsPerPage: number, page: number, res: Response): Promise<void> {
        const pendingFriendsRequests: any[] = await accountFriendsRequest.getExitingPendingFriendsRequests(username, itemsPerPage, page, this.client);
        res.json({ status: 1, data: pendingFriendsRequests });
        return;
    }

    public async getOtherUsers(username: string, itemsPerPage: number, page: number, filter: string, res: Response): Promise<void> {
        const otherUsers: any[] = await accountFriendsRequest.getOtherUsers(username, itemsPerPage, page, filter, this.client);
        res.json({ status: 1, data: otherUsers });
        return;
    }

    public async userConnected(username: string): Promise<void> {
        await this.updateMyStatus(username, 'Connected', 1);
        return;
    }

    public async userDisconnected(username: string): Promise<void> {
        await this.updateMyStatus(username, 'Disconnected', 1);
        return;
    }

    private async updateMyStatus(username: string, status: string, page: number): Promise<void> {
        let rtrn: any[] = await accountFriendsRequest.getFriendUsers(username, 100, page, '', this.client);
        for(const friend of rtrn){
            const socket: RemoteSocket<DefaultEventsMap, any> | undefined = await this.accountNotification.findSocketOfUsername(friend.username);
            if(socket) {
                socket.emit(`user${status}`, username);
            }
        }
        while(rtrn.length === 100) {
            await this.updateMyStatus(username, status, page+1);
        }
        return;
    }

    public async updateDisplay(username: string, component: string): Promise<void> {
        const socket: RemoteSocket<DefaultEventsMap, any> | undefined = await this.accountNotification.findSocketOfUsername(username);
        if(socket){
            await this.accountNotification.synchronizeNotificationsWithRemoteSocket(socket);
            socket.emit(`update${component}`);
        }
    }

    public async sendMessage(username : string, message : string, socket : Socket): Promise<void> {
        //start by finding the socket if it exists else get undefined (if the user is not connected)
        if(socket.data.username === username) {
            return;
        } else if(await accountFriendsRequest.getFriendByBothUsernames(socket.data.username, username, this.client)) {
            //get the socket of the user
            const socketOfUsername: RemoteSocket<DefaultEventsMap, any> | undefined  =
            (await ioServer.io.fetchSockets()).find(
                (socketTmp: RemoteSocket<DefaultEventsMap, any>): boolean => socketTmp.data.username === username
            );

            //convert the date to ISO format
            const dateISO: string = new Date(Date.now()).toISOString();

            //add the message to the database
            let dataMessage: any[] = await accountFriendsRequest.newMessage(socket.data.username, username, message, dateISO, this.client);

            if(dataMessage.length !== undefined) {
                await this.accountNotification.addNotificationMessage(username, dataMessage[0].id);
            }

            //if the socket exists send the message to the user
            if(socketOfUsername !== undefined) {
                ioServer.io.to(socketOfUsername.id).emit('message');
            }
            return
        }
    }

    public async getMessage(socket : Socket): Promise<void> {
        //get the messages from the database
        const request: any[] = await accountFriendsRequest.getMessage(socket.data.username, this.client);

        socket.emit('getMessage', request);
        return
    }
}