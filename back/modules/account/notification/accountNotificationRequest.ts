//----------------------------------------Notification----------------------------------------
//Version 1.0.0 
//This module manage the request to the database for accountNotification.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//1.1.0 - 25/04/2023 - Iémélian RAMBEAU - New version of the notification type in the database, the request are now adapted to the new database
//--------------------------------------------------------------------------------------------

import { Client } from "edgedb";

module AccountNotificationRequest {
    export async function getNotifications(token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            //for every new type in subject, add a new corresponding object in the query
            const result = client.query(`
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
            `);
            resolve(result);
        });
    }
    

    export async function notificationIsSeen(id : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                UPDATE Notification
                FILTER .id = <uuid>"${id}"
                set { seen := true };
            `);
            resolve(result);
        });
    }

    export async function deleteNotification(id : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                DELETE Notification 
                FILTER .id = <uuid>"${id}";
            `);
            resolve(result);
        });
    }

    export async function addNotificationsMessage(username : string, component : string, date : string, idMessage : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                UPDATE User 
                filter .username = "${username}"
                SET {
                    notifications += (INSERT Notification {
                        component := "${component}",
                        date := <datetime>"${date}",
                        object := (SELECT Message FILTER .id = <uuid>"${idMessage}"),
                    })
                }
            `);

            resolve(result);
        });
    }

    export async function getIdOfNotificationOrderByDate(username : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT User {
                    notifications: {
                        id
                    } ORDER BY .date DESC
                }
                FILTER .username = "${username}"
            `);
            resolve(result);
        });
    }
}

export default AccountNotificationRequest;