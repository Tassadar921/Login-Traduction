//----------------------------------------Notification----------------------------------------
//Version 1.0.0 
//This module manages the requests to the database for accountNotification.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//1.1.0 - 25/04/2023 - Iémélian RAMBEAU - New version of the notification type in the database, the requests are now adapted to the new database
//--------------------------------------------------------------------------------------------

import { prisma } from "../../common/prisma/prismaClient";

module AccountNotificationRequest {
    export async function getNotifications(username: string) {
        return await prisma.user.findFirst({
            select: {
                notifications: {
                    select: {
                        notificationsId: true,
                        type: true,
                        date: true,
                        seen: true,
                        objectUser: {
                            select: {
                                username: true,
                                userId: true,
                            }
                        },
                        objectMessage: {
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
                                },
                                receiver: {
                                    select: {
                                        username: true,
                                        userId: true,
                                    }
                                },
                            }
                        }
                    }
                }
            },
            where: {
                username: username
            }
        });
    }


    export async function notificationIsSeen(id: number) {
        return await prisma.notification.update({
            where: {
                notificationsId: id
            },
            data: {
                seen: true
            }
        });
    }

    export async function deleteNotification(id: number) {
        return await prisma.notification.delete({
            where: {
                notificationsId: id
            }
        });
    }

    export async function addNotificationMessage(username: string, type: string, date: string, idMessage: number) {
        return await prisma.user.update({
            where: {
                username: username
            },
            data: {
                notifications: {
                    create: {
                        type: type,
                        date: date,
                        objectMessage: {
                            connect: {
                                messageId: idMessage
                            }
                        }
                    }
                }
            }
        });
    }

    export async function addNotificationAskFriend(senderUsername: string, receiverUsername: string, type: string, date: string) {
        return await prisma.user.update({
            where: {
                username: receiverUsername
            },
            data: {
                notifications: {
                    create: {
                        type: type,
                        date: date,
                        objectUser: {
                            connect: {
                                username: senderUsername
                            }
                        }
                    }
                }
            }
        });
    }
}

export default AccountNotificationRequest;