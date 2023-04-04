//----------------------------------------Notification----------------------------------------
//Version 1.0.0 
//This module manage the request to the database for accountNotification.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------------

import { Client } from "edgedb";

module AccountNotificationRequest {
    export async function getNotifications(token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT Notification {
                    id,
                    title,
                    component,
                    date,
                    seen,
                    objectUser : {
                        id,
                        username,
                    },
                    objectMessage : {
                        id,
                        text,
                    },
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
                        objectMessage := (SELECT Message FILTER .id = <uuid>"${idMessage}"),
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

    export async function addObjectUserToNotification(id : string, usernameSender : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                UPDATE Notification
                FILTER .id = <uuid>"${id}"
                SET {
                    objectUser := (SELECT User FILTER User.username = "${usernameSender}")
                }
            `);
            resolve(result);
        });
    }
}

export default AccountNotificationRequest;