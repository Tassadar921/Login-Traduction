export module socketTypes {
    export type synchronizeNotificationsDataType = {
        notifications: {
            notificationsId: number;
            type: string;
            date: Date;
            seen: boolean;
            objectUser: {
                username: string;
                userId: number;
            } | null;
            objectMessage: {
                messageId: number;
                text: string;
                seen: boolean;
                date: Date;
                sender: {
                    username: string;
                    userId: number;
                };
                receiver: {
                    username: string;
                    userId: number;
                };
            } | null;
        }[];
    } | null;
}