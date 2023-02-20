import * as socketIO from "socket.io";
import {AccountNotification} from "./accountNotification";

module accountRouting {
    export function init(): void {
        interface ServerToClientEvents {
            noArg: () => void;
            emitNotif: (data: [{name : string, text : string, date:Date}]) => void;
        }
        
        interface ClientToServerEvents {
            delete: () => void;
            hello: () => void;
        }
        
        interface InterServerEvents {
            ping: () => void;
        }
        
        interface SocketData {
            username: string;
            token: number;
        }

        const io = new socketIO.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

        io.on('connection', (socket) => {
//            socket.emit('emitNotif', [{name : "test", text : "test", date : new Date()}]);          
            socket.on('delete', () => {

            });
            socket.on('disconnect', () => {
                
            });
        });

        return;
    }
}

export default accountRouting;