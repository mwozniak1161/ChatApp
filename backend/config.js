import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 8080
export const DB = process.env.DB
export const JWT_SECRET = process.env.JWT_SECRET
export const FRONTEND = process.env.FRONTEND

export const corsConfig = {
    origin: FRONTEND,
    credentials:true
}