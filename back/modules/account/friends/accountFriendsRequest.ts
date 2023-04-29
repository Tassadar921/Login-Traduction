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
                        id,
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
                    id,
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

    export async function removeFriend(username1 : string, username2 : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Update User 
                Filter .username = "${username1}"
                Set {
                friends -= (Select User Filter .username = "${username2}"),
                }
            `));
        });
    }

    export async function getUserByUsername(username : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Select User {
                } Filter .username = "${username}"
            `));
        });
    }

    export async function getOtherUsers(username : string, itemsPerPage : number, page : number, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
            Select (with x :=   (Select User {
                        id,
                        username
                    } Filter .username != "${username}"),
                    y := ((Select User {
                    friends : {
                        id,
                        username
                    }} Filter .username = "${username}").friends),
                    zexit := (Select User {
                                    id,
                                    username
                            } Filter User.pendingFriendsRequests.username = "${username}"),
                    zenter := (Select User {
                                    pendingFriendsRequests : {
                                        id,
                                        username
                                    }
                                } Filter .username = "${username}").pendingFriendsRequests,
                    w1 := (Select User {
                                    blockedUsers : {
                                        id,
                                        username
                                    }
                                } Filter .username = "${username}").blockedUsers,
                    w2 := (Select User {
                                    blockedBy : {
                                        id,
                                        username
                                    }
                                } Filter .username = "${username}").blockedBy,
                Select {
                    (x {
                    username,
                    id,
                    boolFriend := (Select y filter y.username = x.username) = x,
                    boolEnteringFriendRequest := (Select zenter filter zenter.username = x.username) = x,
                    boolExitingFriendRequest := (Select zexit filter zexit.username = x.username) = x,
                    c1 := ((Select w1 filter w1.username = x.username) = x),
                    c2 := (Select w2 filter w2.username = x.username) = x,
                    })
                    })
                filter exists .c1 != true and exists .c2 != true
                order by .username
                offset ${itemsPerPage}*(${page}-1)
                limit ${itemsPerPage}
            `));
        });
    }

    export async function addBlockedUser(username1 : string, username2 : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Update User 
                Filter .username = "${username1}"
                Set {
                blockedUsers += (Select User Filter .username = "${username2}"),
                }
            `));
        });
    }

    export async function addBlockedBy(username1 : string, username2 : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Update User 
                Filter .username = "${username1}"
                Set {
                blockedBy += (Select User Filter .username = "${username2}"),
                }
            `));
        });
    }

    export async function removeBlockedUser(username1 : string, username2 : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Update User 
                Filter .username = "${username1}"
                Set {
                blockedUsers -= (Select User Filter .username = "${username2}"),
                }
            `));
        });
    }

    export async function removeBlockedBy(username1 : string, username2 : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Update User 
                Filter .username = "${username1}"
                Set {
                blockedBy -= (Select User Filter .username = "${username2}"),
                }
            `));
        });
    }

    export async function getBlockedUsers(username : string, itemsPerPage : number, page : number, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Select (Select User {
                    blockedUsers : {
                        id,
                        username
                    }
                } Filter .username = "${username}").blockedUsers
                order by .username
                offset ${itemsPerPage}*(${page}-1)
                limit ${itemsPerPage}
            `));
        });
    }

    export async function getBlockedUserByBothUsernames(username1 : string, username2 : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Select User {
                    blockedUsers : {}
                }
                Filter .username = "${username1}" and .blockedUsers.username = "${username2}"
            `));
        });
    }

    export async function getBlockedByByBothUsernames(username1 : string, username2 : string, client : Client) : Promise<unknown[]> {
        return new Promise<any[]>((resolve) => {
            resolve(client.query(`
                Select User {
                    blockedBy : {}
                }
                Filter .username = "${username1}" and .blockedBy.username = "${username2}"
            `));
        });
    }
}

export default accountFriendsRequest;