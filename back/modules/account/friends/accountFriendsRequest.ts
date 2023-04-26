//----------------------------------------Friends----------------------------------------
//Version 1.0.0
//This module manage the request to the database for accountFriends.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//---------------------------------------------------------------------------------------

import { Client } from "edgedb";

module accountFriendsRequest {
    export async function newMessage(sender : string, receiver : string, message : string, date : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                INSERT Message {
                    sender := (SELECT User FILTER .username = "${sender}" limit 1),
                    receiver := (SELECT User FILTER .username = "${receiver}"),
                    date := <datetime>"${date}",
                    text := "${message}"
                }
            `));
        });
    }

    export async function getMessage(receiver : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                SELECT Message {
                    sender : {
                        username,
                    },
                    seen,
                    date,
                    text,
                } FILTER .receiver.username = "${receiver}"
            `));
        });
    }

    export async function getFriends(username : string, page : number, itemsPerPage : number, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Select (Select User {
                    friends : {
                    id,
                    username    
                    }
                } filter .username = "${username}").friends
                order by .username
                offset ${itemsPerPage}*(${page}-1)
                limit ${itemsPerPage}
            `));
        });
    }

    export async function getEnteringPendingFriendsRequests(username : string, page : number, itemsPerPage : number, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Select (Select User {
                    pendingFriendsRequests : {
                    username
                    }
                } Filter .username = "${username}").pendingFriendsRequests
                order by .username
                offset ${itemsPerPage}*(${page}-1)
                limit ${itemsPerPage}
            `));
        });
    }

    export async function getExitingPendingFriendsRequests(username : string, page : number, itemsPerPage : number, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Select User {
                    username
                } Filter User.pendingFriendsRequests.username = "${username}"
                order by .username
                offset ${itemsPerPage}*(${page}-1)
                limit ${itemsPerPage}
            `));
        });
    }
}

export default accountFriendsRequest;