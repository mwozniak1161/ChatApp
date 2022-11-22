import Router from 'express'
import { deleteMessage, getMessages, getUsersConversations, sendMessage } from '../controllers/Messages.js'


const MessagesRouter = Router()

MessagesRouter.get("/conversations", getUsersConversations)
MessagesRouter.get("/:login/all", getMessages)
MessagesRouter.post("/:login/add", sendMessage)
MessagesRouter.post("/:login/delete", deleteMessage)

export default MessagesRouter