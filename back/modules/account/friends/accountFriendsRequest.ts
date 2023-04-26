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

    export async function addPendingFriendsRequests(usernameReceiver : string, usernameSender : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Update User 
                Filter .username = "${usernameReceiver}"
                Set {
                pendingFriendsRequests += (Select User Filter .username = "${usernameSender}"),
                }
            `));
        });
    }

    export async function getFriendByBothUsernames(usernameReceiver : string, usernameSender : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Select User {
                }
                Filter .friends.username = "${usernameSender}" AND .username = "${usernameReceiver}"
            `));
        });
    }

    export async function getPendingFriendsRequestByBothUsernames(usernameReceiver : string, usernameSender : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Select User {
                    pendingFriendsRequests : {}
                }
                Filter .username = "${usernameSender}" and .pendingFriendsRequests.username = "${usernameReceiver}"
            `));
        });
    }

    export async function removePendingFriendsRequests(usernameReceiver : string, usernameSender : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Update User 
                Filter .username = "${usernameReceiver}"
                Set {
                pendingFriendsRequests -= (Select User Filter .username = "${usernameSender}"),
                }
            `));
        });
    }

    export async function addFriend(username1 : string, username2 : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Update User 
                Filter .username = "${username1}"
                Set {
                friends += (Select User Filter .username = "${username2}"),
                }
            `));
        });
    }


}

export default accountFriendsRequest;