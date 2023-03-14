import * as socketIO from 'socket.io';
import http from 'http';

module ioServer{
    export let io : socketIO.Server;
    export function init(server : http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) : void{
        io = new socketIO.Server(server, {cors: {
            origin: process.env.URL_FRONT,
                methods: ["GET", "POST"]
        }});
    }
}

export default ioServer;