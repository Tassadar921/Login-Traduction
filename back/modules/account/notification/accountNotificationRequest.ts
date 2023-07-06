//----------------------------------------Notification----------------------------------------
//Version 1.0.0 
//This module manages the requests to the database for accountNotification.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//1.1.0 - 25/04/2023 - Iémélian RAMBEAU - New version of the notification type in the database, the requests are now adapted to the new database
//--------------------------------------------------------------------------------------------

import {Client} from 'edgedb';

module AccountNotificationRequest {
    export async function getNotifications(sessionToken: string, client: Client): Promise<any[]> {
        return new Promise<any[]>((resolve): void => {
            //for every new type in subject, add a new corresponding object in the query
            resolve(client.query(`
            SELECT (
                SELECT User {
                    notifications: {
                        id,
                        type,
                        date,
                        seen,
                        object : {
                          id,
                          [is User].username,
                          [is Message].sender : {username}
                        }
                    }
                } FILTER .token = "${sessionToken}").notifications
            `));
        });
    }


    export async function notificationIsSeen(id: string, client: Client): Promise<unknown[]> {
        return new Promise<any[]>((resolve): void => {
            resolve(client.query(`
                UPDATE Notification
                FILTER .id = <uuid>"${id}"
                set { seen := true };
            `));
        });
    }

    export async function deleteNotification(id: string, client: Client): Promise<unknown[]> {
        return new Promise<any[]>((resolve): void => {
            resolve(client.query(`
                DELETE Notification 
                FILTER .id = <uuid>"${id}";
            `));
        });
    }

    export async function addNotificationMessage(username: string, type: string, date: string, idMessage: string, client: Client): Promise<unknown[]> {
        return new Promise<any[]>((resolve): void => {
            resolve(client.query(`
                UPDATE User 
                filter .username = "${username}"
                SET {
                    notifications += (INSERT Notification {
                        type := "${type}",
                        date := <datetime>"${date}",
                        object := (SELECT Message FILTER .id = <uuid>"${idMessage}"),
                    })
                }
            `));
        });
    }

    export async function addNotificationAskFriend(receiverUsername: string, type: string, date: string, client: Client): Promise<unknown[]> {
        return new Promise<any[]>((resolve): void => {
            resolve(client.query(`
                SELECT ( UPDATE User 
                filter .username = "${receiverUsername}"
                SET {
                    notifications += (INSERT Notification {
                        type := "${type}",
                        date := <datetime>"${date}",
                    })
                }).notifications ORDER BY .date DESC LIMIT 1
            `));
        });
    }

    export async function addNotificationSenderAskFriend(senderUsername: string, idNotification: string, client: Client): Promise<unknown[]> {
        return new Promise<any[]>((resolve): void => {
            resolve(client.query(`
                UPDATE Notification 
                filter .id = <uuid>"${idNotification}"
                SET {
                    object := (SELECT User FILTER .username = "${senderUsername}"),
                }
            `));
        });
    }

    export async function getNotificationInformations(id: string, client: Client): Promise<unknown[]> {
        return new Promise<any[]>((resolve): void => {
            resolve(client.query(`
                SELECT Notification {
                    type,
                    object
                } FILTER .id = <uuid>"${id}"
            `));
        });
    }

    export async function getUsernameAttachedToNotification(id: string, client: Client): Promise<unknown[]> {
        return new Promise<any[]>((resolve): void => {
            resolve(client.query(`
                SELECT User {
                    username
                } filter .notifications.id = <uuid>"${id}"
            `));
        });
    }
}

export default AccountNotificationRequest;