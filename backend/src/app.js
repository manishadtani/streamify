import express from 'express'
const app = express()
import cookieParser from 'cookie-parser'


import authRoute from './routes/auth.route.js'



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use("/api/auth", authRoute)


export default app