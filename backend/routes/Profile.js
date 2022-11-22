import Router from 'express'
import { acceptFriend, addFriend, getFriends, getProfile, getProfiles, removeFriend } from '../controllers/Profile.js'
 
const ProfileRouter = Router()

ProfileRouter.get("/all/:login", getProfiles)

ProfileRouter.get("/:login", getProfile)
ProfileRouter.post("/:login/add",addFriend)
ProfileRouter.post("/:login/accept",acceptFriend)
ProfileRouter.post("/:login/remove",removeFriend)

ProfileRouter.get("/:login/friends", getFriends)


export default ProfileRouter