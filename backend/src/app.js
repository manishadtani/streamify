import express from 'express'
const app = express()
import cookieParser from 'cookie-parser'
import cors from 'cors'


import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import chatRoute from './routes/chat.route.js'

app.use(cors({
    origin: ['https://streamify-641exdvt3-manish-adtanis-projects.vercel.app','http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE',"OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin',"X-Access-Token"],
}));



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/chat", chatRoute)



export default app