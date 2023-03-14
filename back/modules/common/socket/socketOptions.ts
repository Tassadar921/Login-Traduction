module socketOptions {
    export interface ServerToClientEvents {
        emitNotif: (data: [{name : string, text : string, date:Date}]) => void;
        synchronizeNotifications: (data: any[]) => void;
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
        token: string;
    }    
}

export default socketOptions;