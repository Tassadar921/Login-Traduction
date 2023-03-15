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
                    date,
                    title,
                    seen,
                    text,
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

    export async function addNotifications(username : string, title : string, text : string, date : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                UPDATE User 
                filter .username = "${username}"
                SET {
                    notifications += (INSERT Notification { 
                        title := "${title}",
                        text := "${text}",
                        date := <datetime>"${date}",
                    })
                }
            `);

            resolve(result);
        });
    }
}

export default AccountNotificationRequest;