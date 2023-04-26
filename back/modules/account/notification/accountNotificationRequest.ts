//----------------------------------------Notification----------------------------------------
//Version 1.0.0 
//This module manages the requests to the database for accountNotification.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//1.1.0 - 25/04/2023 - Iémélian RAMBEAU - New version of the notification type in the database, the requests are now adapted to the new database
//--------------------------------------------------------------------------------------------

import { Client } from "edgedb";

module AccountNotificationRequest {
    export async function getNotifications(token : string, client : Client) : Promise<any[]> {
        return new Promise<any[]>((resolve) => {
            //for every new type in subject, add a new corresponding object in the query
            resolve(client.query(`
                SELECT Notification {
                        id,
                        component,
                        date,
                        seen,
                        object := Notification.object[is Message]{
                                id,
                                sender : {username}
                            } 
                            union Notification.object[is User]{
                                username,
                            }
                    }
                    FILTER User.token = "${token}"
            `));
        });
    }
    

    export async function notificationIsSeen(id : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                UPDATE Notification
                FILTER .id = <uuid>"${id}"
                set { seen := true };
            `));
        });
    }

    export async function deleteNotification(id : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                DELETE Notification 
                FILTER .id = <uuid>"${id}";
            `));
        });
    }

    export async function addNotificationsMessage(username : string, component : string, date : string, idMessage : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                UPDATE User 
                filter .username = "${username}"
                SET {
                    notifications += (INSERT Notification {
                        component := "${component}",
                        date := <datetime>"${date}",
                        object := (SELECT Message FILTER .id = <uuid>"${idMessage}"),
                    })
                }
            `));
        });
    }
}

export default AccountNotificationRequest;