import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

const authenticateToken = (req, res, next) => {
    const authToken = req.cookies.jwt
    if (authToken == null) return res.status(401).send({ data: "No user logged in!" })
    jwt.verify(authToken, JWT_SECRET, (err) => {
        if (err) return res.status(403).send({ data: "Operation failed! " })
        next()
    })
}

export const authenticateTokenSocket = (token) =>{
    const decode = jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return "none"
        return decoded
    })
    return decode.userId
}

export default authenticateToken