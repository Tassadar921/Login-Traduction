//----------------------------------------Friends----------------------------------------
//Version 1.0.0
//This module manage the request to the database for accountFriends.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//---------------------------------------------------------------------------------------

import { prisma } from "../../common/prisma/prismaClient";

module accountFriendsRequest {
    export async function newMessage(sender: string, receiver: string, message: string, date: Date) {
        return await prisma.message.create({
            data: {
                text: message,
                date: date,
                seen: false,
                sender: {
                    connect: {
                        username: sender
                    }
                },
                receiver: {
                    connect: {
                        username: receiver
                    }
                }
            }
        });
    }

    export async function getMessage(receiver: string) {
        return await prisma.message.findMany({
            select: {
                messageId: true,
                text: true,
                seen: true,
                date: true,
                sender: {
                    select: {
                        username: true,
                        userId: true,
                    }
                }
            },
            where: {
                receiver: {
                    username: receiver
                }
            },
            orderBy: {
                date: "asc"
            }
        });
    }

    export async function getEnteringPendingFriendsRequests(username: string, itemsPerPage: number, page: number) {
        return await prisma.user.findMany({
            select: {
                username: true,
                userId: true,
            },
            where: {
                pendingFriendsRequestsRelation: {
                    some: {
                        username: username
                    }
                }
            },
            orderBy: {
                username: "asc"
            },
            skip: itemsPerPage * (page - 1),
            take: itemsPerPage,
        });
    }

    export async function getExitingPendingFriendsRequests(username: string, itemsPerPage: number, page: number) {
        return await prisma.user.findMany({
            select: {
                username: true,
                userId: true,
            },
            where: {
                pendingFriendsRequests: {
                    some: {
                        username: username
                    }
                }
            },
            orderBy: {
                username: "asc"
            },
            skip: itemsPerPage * (page - 1),
            take: itemsPerPage,
        });
    }

    export async function addPendingFriendsRequests(usernameSender: string, usernameReceiver: string) {
        return await prisma.user.update({
            where: {
                username: usernameReceiver
            },
            data: {
                pendingFriendsRequests: {
                    connect: {
                        username: usernameSender
                    }
                }
            }
        });
    }

    export async function getFriendByBothUsernames(usernameSender: string, usernameReceiver: string) {
        return await prisma.user.findFirst({
            where: {
                username: usernameSender,
                friends: {
                    some: {
                        username: usernameReceiver
                    }
                }
            }
        });
    }

    export async function getFriendUsers(username: string, itemsPerPage: number, page: number, filter: string) {
        return await prisma.user.findMany({
            select: {
                username: true,
                userId: true,
            },
            where: {
                friendsRelation: {
                    some: {
                        username: username
                    }
                },
                username: {
                    contains: filter
                }
            },
            orderBy: {
                username: "asc"
            },
            skip: itemsPerPage * (page - 1),
            take: itemsPerPage,
        });
    }

    export async function getPendingFriendsRequestByBothUsernames(usernameSender: string, usernameReceiver: string) {
        return await prisma.user.findFirst({
            where: {
                username: usernameSender,
                pendingFriendsRequestsRelation: {
                    some: {
                        username: usernameReceiver
                    }
                }
            }
        });
    }

    export async function removePendingFriendsRequests(usernameSender: string, usernameReceiver: string) {
        return await prisma.user.update({
            where: {
                username: usernameReceiver
            },
            data: {
                pendingFriendsRequests: {
                    disconnect: {
                        username: usernameSender
                    }
                }
            }
        });
    }

    export async function addFriend(username1: string, username2: string) {
        return await prisma.user.update({
            where: {
                username: username1
            },
            data: {
                friends: {
                    connect: {
                        username: username2
                    }
                }
            }
        });
    }

    export async function removeFriend(username1: string, username2: string) {
        return await prisma.user.update({
            where: {
                username: username1
            },
            data: {
                friends: {
                    disconnect: {
                        username: username2
                    }
                }
            }
        });
    }

    export async function getUserByUsername(username: string) {
        return await prisma.user.findUnique({
            where: {
                username: username
            }
        });
    }

    export async function getOtherUsers(username: string, itemsPerPage: number, page: number, filter: string) {
        const query1 = prisma.user.findMany({
            select: {
                username: true,
                userId: true,
            },
            where: {
                username: {
                    contains: filter
                },
                NOT: {
                    username: username
                },
                blockedUsers: {
                    none: {
                        username: username
                    }
                },
                blockedByUsers: {
                    none: {
                        username: username
                    }
                }
            },
            orderBy: {
                username: "asc"
            },
            skip: itemsPerPage * (page - 1),
            take: itemsPerPage,
        });
        const query2 = prisma.user.findUnique({
            select: {
                friends: {
                    select: {
                        username: true
                    }
                },
                pendingFriendsRequests: {
                    select: {
                        username: true
                    }
                },
                pendingFriendsRequestsRelation: {
                    select: {
                        username: true
                    }
                }
            },
            where: {
                username: username,
            }
        });

        return {users : await query1, relations : await query2};
    }

    export async function addBlockedUser(usernameSender: string, usernameReceiver: string) {
        return await prisma.user.update({
            where: {
                username: usernameSender
            },
            data: {
                blockedUsers: {
                    connect: {
                        username: usernameReceiver
                    }
                }
            }
        });
    }

    export async function removeBlockedUser(usernameSender: string, usernameReceiver: string) {
        return await prisma.user.update({
            where: {
                username: usernameSender
            },
            data: {
                blockedUsers: {
                    disconnect: {
                        username: usernameReceiver
                    }
                }
            }
        });
    }

    export async function getBlockedUsers(username: string, itemsPerPage: number, page: number, filter: string) {
        return await prisma.user.findMany({
            where: {
                AND: [
                    {
                        username: username
                    },
                    {
                        blockedUsers: {
                            some: {
                                username: {
                                    contains: filter
                                }
                            }
                        }
                    }
                ]
            },
            select: {
                blockedUsers: {
                    select: {
                        username: true,
                        userId: true
                    },
                    skip: itemsPerPage * (page - 1),
                    take: itemsPerPage,
                    orderBy: {
                        username: 'asc'
                    }
                }
            }
        });
    }

    export async function getBlockedUserByBothUsernames(username1: string, username2: string) {
        return await prisma.user.findFirst({
            where: {
                username: username1,
                blockedUsers: {
                    some: {
                        username: username2
                    }
                }
            }
        });
    }

    export async function getBlockedByByBothUsernames(username1: string, username2: string) {
        return await prisma.user.findFirst({
            where: {
                username: username1,
                blockedByUsers : {
                    some: {
                        username: username2
                    }
                }
            }
        });
    }

    export async function getNumberOfOtherUser(username: string) {
        return await prisma.user.count({
            where: {
                username: {
                    not: username
                },
                blockedByUsers: {
                    none: {
                        username: username
                    }
                },
                blockedUsers: {
                    none: {
                        username: username
                    }
                },
            }
        });
    }

    export async function getNumberOfBlockedUsers(username: string) {
        return await prisma.user.count({
            where: {
                blockedByUsers: {
                    some: {
                        username: username
                    }
                }
            }
        });
    }

    export async function getFriendUsersNumber(username: string) {
        return await prisma.user.count({
            where: {
                friendsRelation: {
                    some: {
                        username: username
                    }
                }
            }
        });
    }
}

export default accountFriendsRequest;