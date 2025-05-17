import express from 'express'
const app = express()
import cookieParser from 'cookie-parser'
import cors from 'cors'


import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import chatRoute from './routes/chat.route.js'

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/chat", chatRoute)



export default app