import mongoose from 'mongoose'

const connect = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Database is connected")
    })
    .catch((err)=>{
        console.log(err)
    })
}


export default connect;