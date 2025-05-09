    import { StreamChat } from "stream-chat";
    import "dotenv/config"

    const apiKey = process.env.STREAM_API_KEY 
    const apiSecret = process.env.STREAM_API_SECRET 

    if(!apiKey || !apiSecret){
        console.error("Stream API key or Secret is missing")
    }

    const streamClient = StreamChat.getInstance(apiKey, apiSecret);


    export const upsertStreamUser = async (userData) => {
        try {
            await streamClient.upsertUser(userData);
            return userData
        } catch (error) {
            console.error("Error upserting stream user:", error)
            
        }
    }


    export const generateStreamToken = (userId) => {
        try {
            const userIdStr = userId.toString();
            return streamClient.createToken(userIdStr)
        } catch (error) {
            console.log("error in generating token :"+ error)
        }
    }