import * as socketIO from 'socket.io';

module ioServer{
    export let io;
    export function init(server) : void{
        io = new socketIO.Server(server, {cors: {
            origin: process.env.URL_FRONT,
                methods: ["GET", "POST"]
        }});
    }
}

export default ioServer;