//----------------------------------------socket----------------------------------------
//Version 1.0.0 
//This module contains the ioServer so that it can be called from anywhere in the project
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

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