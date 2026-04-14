import cors from 'cors';
 import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import type {ServerToClientEvents, ClientToServerEvents} from './types/server';


const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);
app.use(cors());



io.on("connection", (socket)=> {
    //When the user connect to the server, we log this
    console.log("A user Connected !");


    socket.on("message", ({ user, message })=> {
        console.log('sending message', {user, message});
        const date = new Date();


        io.emit("message", { user, message, date });
    });

    socket.on("disconnect", ()=> {
        console.log("A user disconnected");
    });
});


const PORT = process.env.PORT || 3001;


server.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`);
});
