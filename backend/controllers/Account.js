import Accounts from '../models/Account.js'
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'
import Message from '../models/Message.js'

export const loginExists = async (req, res) =>{
    try{
        const { login } = req.query
        const Account = await Accounts.findOne({ login })
        if (Account) {
            return res.status(200).send("User already exists!")
        } 
        return res.status(200).send("User don't exists!")
    }catch(e){
        return res.status(403).send({data:"Operation failed!"})
    }
}

export const createUser = async (req, res) => {
    try{
        if (!req.body.login) return res.status(400).send("Failed to create user!")
        const { login, password } = req.body
        const Account = await Accounts.findOne({ login })
        if(Account) throw new Error
        let hashedPassword = ""
        if (password!==""){
            hashedPassword = await bcrypt.hash(password, 13)
        }
        const createAccount = new Accounts({login, hashedPassword, accountType: hashedPassword==="" ? "temporary" : "standard", avatarURL:"", memberSince: Date.now()})
        createAccount.save()
        return res.status(201).send("User created!" );
    } catch(e){
        return res.status(400).send("Failed to create user!")
    }
}

export const loginUser = async (req, res) => {
    try{
        const { login, password } = req.body
        const Account = await Accounts.findOne({ login });
        if (!Account) {
            return res.status(401).send('Login invalid.')
        }
        const isValidPassword =  await bcrypt.compare(password, Account.hashedPassword);
        if (!isValidPassword && password!=="") {
            return res.status(401).send('Password invalid.')
        }
        const token = Jwt.sign({ userId: Account._id }, process.env.JWT_SECRET)
        res.cookie("jwt", token, { expires: new Date(Date.now() + 90000000000000), secure: false, httpOnly: true })
        res.cookie("login", Account.login, { expires: new Date(Date.now() + 90000000000000), secure: false })
        return res.status(200).send("Successfully logged in!")
    } catch(e){
        return res.status(400).send("Cannot login")
    }
}


export const logoutUser = async (req, res) => {
    try {
        await setOnline(req.body.id, false)
        res.clearCookie('jwt');
        res.clearCookie('login');
        res.send({ data: "Successfully logged out!" })
    }
    catch (e) {
        res.status(400).send({ data: "Logout failed!" })
    }
}

export const getUser = async (req, res) => {
    try{
        const login = req.params.login
        let Account = await Accounts.findOne({ login });
        const { hashedPassword, ...others } = Account._doc;
        return res.status(200).send(others)
    }catch(e){
        return res.status(400).send({ data: "Failed to get information!" })
    }
}

export const changePassword = async (req, res) => {
    try{
        const { login, password } = req.body
        const Account = await Accounts.findOne({ login });
        if(password===""){
            if (Account.hashedPassword === "") return res.status(200).send("This is old password!")
            await Accounts.findOneAndUpdate({ login }, {$set: {accountType:"temporary"}})
            await Accounts.findOneAndUpdate({ login }, { $set: { hashedPassword:"" } })
            return res.status(200).send("Password successfully changed!")
        }else{
            await Accounts.findOneAndUpdate({ login }, {accountType: "standard"})
        }
        const isCurrentPassword = await bcrypt.compare(password, Account.hashedPassword);
        const hashedPassword = await bcrypt.hash(password, 13)
        if(isCurrentPassword){
            return res.status(200).send("This is old password!")
        }
        await Accounts.findOneAndUpdate({ login }, { $set: {hashedPassword}})
        return res.status(200).send("Password successfully changed!")
    }
    catch(e){
        return res.status(200).send("Cannot change password!")
    }
}

export const changeAvatar = async (req, res) => {
    try {
        const { login, avatarURL } = req.body
        await Accounts.findOneAndUpdate({ login }, { avatarURL })
        return res.status(200).send("Avatar successfully changed!")
     }
    catch (e) { 
        return res.status(200).send("Cannot change avatar!")
    }
}



export const deleteAccount = async (req, res) => {
    try {
        const { login, password } = req.body
        const Account = await Accounts.findOne({ login });
        let safetyCheckPassword
        if(Account.hashedPassword!==""){
            safetyCheckPassword = await bcrypt.compare(password, Account.hashedPassword);
        }else{
            safetyCheckPassword = true
        }
        if(!safetyCheckPassword){
            return res.status(200).send("Invalid password!")
        }
        await Accounts.findOneAndRemove({login})
        res.clearCookie('jwt');
        res.clearCookie('login');
        return res.status(200).send("Account successfully deleted!")
    }
    catch (e) {
        return res.status(200).send("Cannot delete account!")
    }
}

export const setOnline = async (id, isOnline) => {
    try { 
        const Account = await Accounts.findOneAndUpdate({ _id:id }, {isOnline});
        if (!isOnline && Account.accountType==="temporary"){
            await Message.deleteMany({ $or: [{ receiver: Account.login}, {sender:Account.login}]})
            const lol = await Accounts.findOneAndRemove({_id:id})
        }
    }
    catch (e) {
        return "Error"
    }
}