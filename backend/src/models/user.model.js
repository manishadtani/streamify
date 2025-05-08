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


userSchema.pre("save", async function(next){

    if(!this.isModified("password")) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next();
    } catch (error) {   
        next(error);
    }
})


userSchema.methods.matchPassword = async function(enteredpassword){
    const isPasswordCorrect = await bcrypt.compare(enteredpassword, this.password)
    return isPasswordCorrect
}

const userModel = mongoose.model('user',userSchema)




export default userModel