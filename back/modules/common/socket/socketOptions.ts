//----------------------------------------socketOptions----------------------------------------
//Version 1.0.0 
//This module contains all the interfaces used for the ts socket
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

import { socketTypes } from "./socketTypes";

module socketOptions {
    export interface ServerToClientEvents {
        emitNotif: (data: [{ name: string, text: string, date: Date }]) => void;
        synchronizeNotifications: (data: socketTypes.synchronizeNotificationsDataType) => void;
        sendMessage: (username: string, message: string, date: Date) => void;
        initSocketData: () => void;
    }

    export interface ClientToServerEvents {
        initSocketData: (username: string, token: string) => void;
        synchronizeNotifications: () => void;
        notificationIsSeen: (id: string) => void;
        deleteNotification: (id: string) => void;
        sendMessage: (username: string, message: string, date: Date) => void;
        getChat: (username: string) => void;
        addNotifications: (username: string, title: string, text: string) => void;
    }

    export interface InterServerEvents {
        ping: () => void;
    }

    export interface SocketData {
        username: string;
        sessionToken: string;
    }
}

export default socketOptions;