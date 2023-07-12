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
import {DefaultEventsMap} from 'socket.io/dist/typed-events';
import {Response} from 'express';
import accountNotificationRequest from '../notification/accountNotificationRequest';

export class AccountFriends{
    private accountNotification: AccountNotification;

    constructor(accountNotification : AccountNotification) {
        this.accountNotification = accountNotification;
    }

    public async getNumberOfOtherUser(username: string, res: Response): Promise<void> {
        const numberOfOtherUsers = await accountFriendsRequest.getNumberOfOtherUser(username);
        res.json({ status:1, data: numberOfOtherUsers });
    }

    public async cancelFriendRequest(username: string, usernameReceiver: string, res: Response): Promise<void> {
        if (username === usernameReceiver) {
            res.json({ status: -1 });
            return;
        } else if (!(await accountFriendsRequest.getUserByUsername(usernameReceiver))) {
            res.json({ status: -2 });
            return;
        } else {
            await accountFriendsRequest.removePendingFriendsRequests(username, usernameReceiver);
            await this.updateDisplay(usernameReceiver, 'AddComponent');
            res.json({ status: 1 });
        }
    }

    public async refuseFriendRequest(username: string, usernameSender: string, res: Response): Promise<void> {
        if (usernameSender === username) {
            res.json({ status: -1 });
            return;
        } else if (!(await accountFriendsRequest.getUserByUsername(usernameSender))) {
            res.json({ status: -2 });
            return;
        } else {
            await accountFriendsRequest.removePendingFriendsRequests(usernameSender, username);
            await this.updateDisplay(usernameSender, 'AddComponent');
            res.json({ status: 1 });
            return;
        }
    }

    public async blockUserIntermediary(usernameSender: string, usernameReceiver: string, enteringAddFriendNotifId: string, exitingAddFriendNotifId: string, res: Response): Promise<void> {
        if (usernameSender === usernameReceiver) {
            res.json({ status: -1 });
            return;
        } else if (await accountFriendsRequest.getUserByUsername(usernameReceiver) === undefined) {
            res.json({ status: -2 });
            return;
        } else if (await accountFriendsRequest.getFriendByBothUsernames(usernameSender, usernameReceiver)) {
            await accountFriendsRequest.removeFriend(usernameSender, usernameReceiver);
            await accountFriendsRequest.removeFriend(usernameReceiver, usernameSender);
            await this.blockUser(usernameSender, usernameReceiver, res);
            return;
        } else if(await accountFriendsRequest.getPendingFriendsRequestByBothUsernames(usernameSender, usernameReceiver)){
            await accountFriendsRequest.removePendingFriendsRequests(usernameReceiver, usernameSender);
            await accountNotificationRequest.deleteNotification(Number(enteringAddFriendNotifId));
            await this.blockUser(usernameSender, usernameReceiver, res);
            return;
        } else if(await accountFriendsRequest.getPendingFriendsRequestByBothUsernames(usernameReceiver, usernameSender)) {
            await accountFriendsRequest.removePendingFriendsRequests(usernameSender, usernameReceiver);
            await accountNotificationRequest.deleteNotification(Number(exitingAddFriendNotifId));
            await this.blockUser(usernameSender, usernameReceiver, res);
            return;
        } else {
            await this.blockUser(usernameSender, usernameReceiver, res);
            return;
        }
    }

    private async blockUser(usernameSender: string, usernameReceiver: string, res: Response): Promise<void> {
        await accountFriendsRequest.addBlockedUser(usernameSender, usernameReceiver);
        await this.updateDisplay(usernameSender, 'AddComponent');
        await this.updateDisplay(usernameReceiver, 'AddComponent');
        res.json({ status: 1 });
    }

    public async getBlockedUsers(username: string, itemsPerPage: number, page: number, filter: string, res: Response): Promise<void> {
        const blockedUsers = await accountFriendsRequest.getBlockedUsers(username, itemsPerPage, page, filter);
        res.json({ status: 1, data: blockedUsers });
    }

    public async getNumberOfBlockedUsers(username: string, res: Response): Promise<void> {
        const blockedUsersNumber = await accountFriendsRequest.getNumberOfBlockedUsers(username);
        res.json({ status:1, data: blockedUsersNumber });
    }

    public async removeFriend(usernameSender: string, usernameReceiver: string, res: Response): Promise<void> {
        if (usernameSender === usernameReceiver) {
            res.json({ status: -1 });
            return;
        } else if (await accountFriendsRequest.getUserByUsername(usernameReceiver)) {
            res.json({ status: -2 });
            return;
        } else if (await accountFriendsRequest.getFriendByBothUsernames(usernameSender, usernameReceiver)) {
            await accountFriendsRequest.removeFriend(usernameSender, usernameReceiver);
            await accountFriendsRequest.removeFriend(usernameReceiver, usernameSender);
            await this.updateDisplay(usernameSender, 'AddComponent');
            await this.updateDisplay(usernameReceiver, 'AddComponent');
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
        } else if (await accountFriendsRequest.getUserByUsername(usernameReceiver) === undefined) {
            res.json({ status: -2 });
            return;
        } else if (await accountFriendsRequest.getBlockedUserByBothUsernames(usernameSender, usernameReceiver)) {
            await accountFriendsRequest.removeBlockedUser(usernameSender, usernameReceiver);
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
        } else if (!await accountFriendsRequest.getUserByUsername(usernameReceiver)) {
            res.json({ status: -2 });
            return;
        } else if (await accountFriendsRequest.getBlockedUserByBothUsernames(usernameSender, usernameReceiver)) {
            res.json({ status: -3 });
            return;
        } else if (await accountFriendsRequest.getBlockedByByBothUsernames(usernameReceiver, usernameSender)) {
            res.json({ status: -4 });
            return;
        } else if (await accountFriendsRequest.getFriendByBothUsernames(usernameSender, usernameReceiver)) {
            res.json({ status: 0 });
            return;
        } else if(await accountFriendsRequest.getPendingFriendsRequestByBothUsernames(usernameSender, usernameReceiver)){
            await accountFriendsRequest.removePendingFriendsRequests(usernameReceiver, usernameSender);
            await accountFriendsRequest.addFriend(usernameSender, usernameReceiver);
            await accountFriendsRequest.addFriend(usernameReceiver, usernameSender);
            await this.updateDisplay(usernameSender, 'AddComponent');
            await this.updateDisplay(usernameReceiver, 'AddComponent');
            res.json({ status: 10 });
            return;
        } else {
            await accountFriendsRequest.addPendingFriendsRequests(usernameSender, usernameReceiver);
            await this.accountNotification.addNotificationAskFriend(usernameReceiver, usernameSender);
            await this.updateDisplay(usernameSender, 'AddComponent');
            await this.updateDisplay(usernameReceiver, 'AddComponent');
            res.json({ status: 11 });
            return;
        }
    }

    public async getFriendUsers(username: string, itemsPerPage: number, page: number, filter: string, res: Response): Promise<void> {
        const friends = await accountFriendsRequest.getFriendUsers(username, itemsPerPage, page, filter);
        const friendsData : {username: string;userId: number;online : boolean}[] = [];
        for(const friend of friends){
            if(await this.accountNotification.findSocketOfUsername(friend.username)){
                friendsData.push({username: friend.username, userId: friend.userId, online: true});
            }
        }
        res.json({ status: 1, data: friendsData });
        return;
    }

    public async getFriendUsersNumber(username: string, res: Response): Promise<void> {
        const friends = await accountFriendsRequest.getFriendUsersNumber(username);
        res.json({ status: 1, data: friends});
        return;
    }

    public async getEnteringPendingFriendsRequests(username: string, itemsPerPage: number, page: number, res: Response): Promise<void> {
        const pendingFriendsRequests = await accountFriendsRequest.getEnteringPendingFriendsRequests(username, itemsPerPage, page);
        res.json({ status: 1, data: pendingFriendsRequests });
        return;
    }

    public async getExitingPendingFriendsRequests(username: string, itemsPerPage: number, page: number, res: Response): Promise<void> {
        const pendingFriendsRequests = await accountFriendsRequest.getExitingPendingFriendsRequests(username, itemsPerPage, page);
        res.json({ status: 1, data: pendingFriendsRequests });
        return;
    }

    public async getOtherUsers(username: string, itemsPerPage: number, page: number, filter: string, res: Response): Promise<void> {
        const otherUsersAndRealtions = await accountFriendsRequest.getOtherUsers(username, itemsPerPage, page, filter);

        const otherUsers : {username: string; userId: number; boolFriend: boolean; boolExitingFriendRequest: boolean; boolEnteringFriendRequest: boolean;}[] = [];

        otherUsersAndRealtions.users.forEach((user) => {
            let boolFriend = otherUsersAndRealtions.relations?.friends.some(friend => friend.username === user.username);
            let boolEnteringFriendRequest = otherUsersAndRealtions.relations?.pendingFriendsRequests.some(pendingFriendRequest => pendingFriendRequest.username === user.username);
            let boolExitingFriendRequest = otherUsersAndRealtions.relations?.pendingFriendsRequestsRelation.some(pendingFriendRequestRelation => pendingFriendRequestRelation.username === user.username);

            otherUsers.push({username: user.username, userId: user.userId, boolFriend: boolFriend || false, boolExitingFriendRequest: boolExitingFriendRequest || false, boolEnteringFriendRequest: boolEnteringFriendRequest || false});
        });

        console.log(otherUsers);

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
        let rtrn: any[] = await accountFriendsRequest.getFriendUsers(username, 100, page, '');
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
        } else if(await accountFriendsRequest.getFriendByBothUsernames(socket.data.username, username)) {
            //get the socket of the user
            const socketOfUsername: RemoteSocket<DefaultEventsMap, any> | undefined  =
            (await ioServer.io.fetchSockets()).find(
                (socketTmp: RemoteSocket<DefaultEventsMap, any>): boolean => socketTmp.data.username === username
            );

            const date = new Date(Date.now());

            //add the message to the database
            let dataMessage = await accountFriendsRequest.newMessage(socket.data.username, username, message, date);

            if(dataMessage) {
                await this.accountNotification.addNotificationMessage(username, dataMessage.messageId);
            }

            //if the socket exists send the message to the user
            if(socketOfUsername) {
                socketOfUsername.emit('sendMessage', {username: socket.data.username, message: message, date: date});
            }
            return
        }
    }

    public async getMessage(socket : Socket): Promise<void> {
        //get the messages from the database
        const request: any[] = await accountFriendsRequest.getMessage(socket.data.username);

        socket.emit('getMessage', request);
        return
    }
}