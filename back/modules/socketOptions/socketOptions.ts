module socketOptions {
    export interface ServerToClientEvents {
        noArg: () => void;
        emitNotif: (data: [{name : string, text : string, date:Date}]) => void;
    }
    
    export interface ClientToServerEvents {
        noArg: () => void;
        emitNotif: (data: [{name : string, text : string, date:Date}]) => void;
        hello: () => void;
    }
    
    export interface InterServerEvents {
        ping: () => void;
    }
    
    export interface SocketData {
        username: string;
        token: number;
    }    
}

export default socketOptions;