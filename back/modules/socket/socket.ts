import * as socketIO from 'socket.io';
import { Server } from 'http';

module ioServer{
    export let io: any;
    export function init(server: Server) : void{
        console.log(process.env.URL_FRONT);
        io = new socketIO.Server(server, {cors: {
            origin: process.env.URL_FRONT,
                methods: ["GET", "POST"]
        }});
    }
}

export default ioServer;