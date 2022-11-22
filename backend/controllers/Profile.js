import { authenticateTokenSocket } from '../middlewares/Auth.js'
import Accounts from '../models/Account.js'

export const getFriends = async (req, res) =>{
    try{
        const {login} = req.params
        const Account = await Accounts.findOne({ login })
        const Friends = await Accounts.find({ login: {$in : [...Account.friends]} })
        const PendingFriends = await Accounts.find({ login: {$in : [...Account.pendingFriends]} })
        const FriendsList = {
            pending: [],
            online: [],
            offline: []
        }
        PendingFriends.forEach(i=>{
            FriendsList.pending.push({
                login: i.login,
                avatarURL: i.avatarURL,
                isOnline: i.isOnline
            })
        })
        Friends.forEach(i => {
            if(i.isOnline){
                FriendsList.online.push({
                    login: i.login,
                    avatarURL: i.avatarURL,
                    isOnline: i.isOnline
                })
            }else{
                FriendsList.offline.push({
                    login: i.login,
                    avatarURL: i.avatarURL,
                    isOnline: i.isOnline
                })
            }
        })
        return res.status(200).send(FriendsList)
    }
    catch(e){
        return res.status(200).send("Error")
    }
}

export const getProfile = async (req, res) =>{
    try{
        const { login } = req.params
        const Profile = await Accounts.findOne({ login })
        const Account = await Accounts.findOne({ login: req.cookies.login})
        const Response = {
            login: Profile.login,
            avatarURL: Profile.avatarURL,
            isFriend: Account.friends.includes(login),
            isPendingFriend: Account.pendingFriends.includes(login),
            isPendingInvitation: Profile.pendingFriends.includes(Account.login),
            isOnline:Profile.isOnline,
            memberSince: Profile.memberSince
        }
        return res.status(200).send(Response)
    }catch(e){
        return res.status(200).send("Error")   
    }
}

export const getProfiles = async (req, res) =>{
    try{
        const { login } = req.params
        const Profiles = await Accounts.find({  login: new RegExp(login)})
        const Response = []
        Profiles?.forEach(i=>{
            Response.push({
                login: i.login,
                avatarURL: i.avatarURL,
                isOnline: i.isOnline
            })
        })
        return res.status(200).send({Profiles: Response})   
    }catch(e){
        return res.status(200).send("Error")   
    }
}


export const addFriend = async (req, res) => {
    try {
        const { login } = req.params
        const Profile = await Accounts.findOneAndUpdate({ login }, { $push : { pendingFriends: req.cookies.login }})
        return res.status(200).send("Friend invitation sended!")
    } catch (e) {
        return res.status(200).send("Error")
    }
}


export const removeFriend = async (req, res) => {
    try {
        const { login } = req.params
        const Account = await Accounts.findOneAndUpdate({ login: req.cookies.login }, { $pull: { friends: login } })
        const Profile = await Accounts.findOneAndUpdate({ login }, { $pull: { friends: req.cookies.login } })
        return res.status(200).send("Friend Acceptet!")
    } catch (e) {
        return res.status(200).send("Error")
    }
}

export const acceptFriend = async (req, res) => {
    try {
        const { login } = req.params
        const Account = await Accounts.findOneAndUpdate({ login: req.cookies.login }, { $pull : { pendingFriends : login }, $push : { friends: login}})
        const Profile = await Accounts.findOneAndUpdate({ login }, { $push: { friends: req.cookies.login } } )
        return res.status(200).send("Friend added!")
    } catch (e) {
        return res.status(200).send("Error")
    }
}




