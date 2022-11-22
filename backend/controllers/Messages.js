import Messages from '../models/Message.js'
import Accounts from '../models/Account.js'

export const getUsersConversations = async (req, res) => {
    try {
        const Conversations = await Messages.find({ $or: [{ sender: req.cookies.login, isFirst: true }, { receiver: req.cookies.login, isFirst:true }] })
        const Logins = []
        Conversations.forEach(conv => {
            Logins.push(conv.sender, conv.receiver)
        })
        let FilteredLogins = Logins.filter((conv, indx, arr)=>{
            return arr.indexOf(conv) === indx
        })
        FilteredLogins = FilteredLogins.filter((user)=>{
            return user !== req.cookies.login
        })
        const Response = await Accounts.find({ login: FilteredLogins }).select("-_id login avatarURL")
        return res.status(200).send({data: Response})
    } catch (e) {
        return res.status(200).send("Error")
    }
}

export const getMessages = async (req, res) => {
    try {
        const { login } = req.params
        const AllMessages = await Messages.find({ $or: [{ receiver: login, sender: req.cookies.login }, { receiver: req.cookies.login, sender: login } ] })
        return res.status(200).send({AllMessages})
    } catch (e) {
        return res.status(200).send("Error")
    }
}

export const sendMessage = async (req, res) => {
    try {
        if(!req.body.newMessage) throw new Error
        const { login } = req.params
        const firstMessageExists = await Messages.findOne({ $or: [{ receiver: login, sender: req.cookies.login, isFirst:true }, { receiver: req.cookies.login, sender: login, isFirst:true }] })
        const createMessage = await new Messages({id:req.body.id, sender:req.cookies.login, receiver:login, date: Date.now(), text: req.body.newMessage, isFirst: firstMessageExists ? false : true })
        createMessage.save()
        return res.status(200).send(firstMessageExists ? "Message sent!" : "First message sent!")
    } catch (e) {
        return res.status(200).send("Error")
    }
}

export const deleteMessage = async (req, res) =>{
    try{
        const { login } = req.params
        let updatedFirst
        const deletedMessage = await Messages.findOneAndRemove({id:req.body.id, sender: req.body.senderLogin})
        if(deletedMessage?.isFirst){
            updatedFirst = await Messages.findOneAndUpdate({ $or: [{ receiver: login, sender: req.cookies.login }, { receiver: req.cookies.login, sender: login }] }, { $set: { isFirst: true } })
        }
        return res.status(200).send(updatedFirst ? "Message deleted and conversation updated!" : "Message deleted!")
    }catch(e){
        return res.status(200).send("Error")
    }
}

