import { Client } from "edgedb";
import { uuid } from "edgedb/dist/codecs/ifaces";

export module AccountNotificationRequest {
    export async function getNotifications(token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT Notification {
                    id,
                    date,
                    name,
                    seen,
                    text,
                }
                FILTER User.token = "${token}"
            `);
            resolve(result);
        });
    }

    export async function notificationIsSeen(id : uuid, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                UPDATE Notification
                FILTER .id = <uuid>"${id}"
                set { seen := true };
            `);
            resolve(result);
        });
    }

    export async function deleteNotification(id : uuid, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                DELETE Notification 
                FILTER .id = <uuid>'${id}';
            `);
            resolve(result);
        });
    }

    export async function addNotifications(token : string, client : Client) {
        return new Promise<any[]>((resolve) => {
            const result = client.query(`
                SELECT Notification {

            `);
            resolve(result);
        });
    }
}