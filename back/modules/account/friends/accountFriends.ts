import { Socket } from 'socket.io';
import { AccountNotification } from '../notification/accountNotification';
import ioServer from '../../socket/socket';
import accountFriendsRequest from './accountFriendsRequest';

export class AccountFriends{
    private accountNotification: AccountNotification;
    constructor(accountNotification : AccountNotification) {
        this.accountNotification = accountNotification;
    }

    public async sendMessage(socket : Socket, username : string, message : string, date : Date) {
        const toSocket = (await ioServer.io.fetchSockets()).find((socketTmp) => socketTmp.data.username === username);
        this.accountNotification.addNotifications(username, 'Nouveau message', message);

        

        if(toSocket !== undefined) {
            ioServer.io.to(toSocket?.id!).emit('sendMessage', socket.data.username!, message, date);
        }
    }
}