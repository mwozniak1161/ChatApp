import Router from 'express'
import { getUser, createUser, loginExists, loginUser, logoutUser, changeAvatar, changePassword, deleteAccount } from '../controllers/Account.js'

const AccountRouter = Router()

AccountRouter.get('/users/:login', getUser)
AccountRouter.get('/loginExists', loginExists)
AccountRouter.post('/createUser', createUser)
AccountRouter.post('/logout', logoutUser)
AccountRouter.post('/loginUser', loginUser)
AccountRouter.post('/changeAvatarURL', changeAvatar)
AccountRouter.post('/changePassword', changePassword)
AccountRouter.post('/delete', deleteAccount)

export default AccountRouter