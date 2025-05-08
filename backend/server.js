import { configDotenv } from 'dotenv'
configDotenv()
import app from './src/app.js'
import connect from './src/db/db.js'
connect();

const port = process.env.PORT




app.listen(port, ()=>{
    console.log("Server is running on port "+port)
})