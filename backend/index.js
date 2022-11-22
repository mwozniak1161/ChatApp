import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import http from "http"
import { Server } from "socket.io";

import { PORT, corsConfig, DB} from './config.js'
import AccountRouter from './routes/Account.js'
import MessagesRouter from './routes/Messages.js';
import ProfileRouter from './routes/Profile.js';

import { SocketListeners } from './socket.js';
import getCookie from './getCookie.js';

const app = express();
const server = http.createServer(app)


app.use(cors(corsConfig))
app.use(express.json())
app.use(cookieParser())

export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND,
        methods: ['GET', 'POST'],
        credentials:true
    },
})

io.use((socket, next) => {
    try{
        const cookies = socket.handshake.headers.cookie
        socket.userLogin = getCookie("login", cookies)
        next()
    }catch(e){
    }
})

io.on("connection", SocketListeners)

app.use("/account", AccountRouter)
app.use("/messages", MessagesRouter)
app.use("/profiles", ProfileRouter)

mongoose.connect(DB).then(()=>{
    server.listen(PORT, () => {
        console.log('Example app listening on port ' + PORT);
    });
}).catch(()=>{
    console.log("Connecting to DB failed!");
})
