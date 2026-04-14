import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import {ServerToClientEvents, ClientToServerEvents} from '@/types';


const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents. ServerToClientEvents>(server);
app.use(cors());
