import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({

    fullname: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
        minlength:6
    },
    bio:{
        type:String,
        default:""
    },
    profilePic:{
        type:String,
        default:""
    },
    nativeLanguage:{
        type:String,
        default:""
    },
    learningLanguage:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    isOnBoarded:{
        type:Boolean,
        default:false
    },
    friends: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ]


}, {timestamps:true})




const userModel = mongoose.model('user',userSchema)


userSchema.pre("save", async function(next){
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})


export default userModel