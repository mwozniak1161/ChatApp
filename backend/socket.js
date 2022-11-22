import { setOnline } from './controllers/Account.js';
import getCookie from './getCookie.js';
import { authenticateTokenSocket } from './middlewares/Auth.js';
import Accounts from './models/Account.js';
import Message from './models/Message.js';
import { io } from './index.js'

export const SocketListeners = async (socket) => {
    if (socket.userLogin) {
        socket.join(socket.userLogin)
    }
    const cookies = socket.handshake.headers.cookie
    const userId = authenticateTokenSocket(getCookie("jwt", cookies))
    const login = getCookie("login", cookies)
    
    await setOnline(userId, true)

    let UsersFriends = await Accounts.findOne({ login: socket.userLogin }).select("-_id friends")
    let UserType = await Accounts.findOne({ login: socket.userLogin }).select("-_id accountType")
    UsersFriends?.friends.forEach(profile => {
        socket.to(profile).emit("profileChanged", socket.userLogin, "online")
    })

    socket.on("sendMsg", (msg, receiver) => { 
        socket.to(receiver).emit("receiveMsg", msg)
     })

    socket.on("changeProfile", ( receiver ) => {
        io.in(socket.userLogin).emit("profileChanged")
        socket.to(receiver).emit("profileChanged")
     })

    socket.on("createConversation", (receiver) => {
        io.in(socket.userLogin).emit("conversationCreated")
        socket.to(receiver).emit("conversationCreated")
    })
    
    socket.on("deleteMessage", (msg, receiver) => {
        io.in(socket.userLogin).emit("messageDeleted", msg)
        socket.to(receiver).emit("messageDeleted", msg)
    })
    
    socket.on("disconnect", async () => {
  
                const Conversations = await Message.find({ $or: [{ sender: socket.userLogin, isFirst: true }, { receiver: socket.userLogin, isFirst: true }] }).select("-_id sender receiver")
                const Logins = []
                Conversations.forEach(conv => {
                    Logins.push(conv.sender, conv.receiver)
                })
                let FilteredLogins = Logins.filter((conv, indx, arr) => {
                return arr.indexOf(conv) === indx
            })
            FilteredLogins = FilteredLogins.filter((user) => {
                return user !== socket.userLogin
            })
            
            FilteredLogins.forEach(user=>{
                socket.to(user).emit("conversationCreated")
            })
        
        
        UsersFriends?.friends.forEach(profile => {
                socket.to(profile).emit("profileChanged", profile, "offline")
            })
            
            await setOnline(userId, false)
        })
    }