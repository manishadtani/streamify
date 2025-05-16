import userModel from "../models/user.model.js";
import FriendRequest from "../models/friendrequest.js";

export const getRecomendedUsers = async (req,res) => {
        try {
                    const currentUserId = req.user.id;
                    const currentUser = req.user


                    const recomendedUsers = await userModel.find({
                        $and: [
                            {_id: {$ne: currentUserId}}, //exclude current user
                            {_id: {$nin: currentUser.friends}}, // exclude current user friends
                            {isOnBoarded:true},
                        ]
                    })
                    res.status(200).json(recomendedUsers);  
        } catch (error) {
                console.log("Error in getrecomended user controller", error.message)
                res.status(500).json({message:"Internal Server Error"})
        }

        
}


export const getMyFriends = async (req,res) => {
            try {
                const user = await userModel.findById(req.user.id)
                .select("friends")
                .populate("friends", "fullname profilePic nativeLanguage learningLanguage")
                res.status(200).json(user.friends)
            } catch (error) {
                console.log("Error in getMyFriend in user controller", error.message)
                res.status(500).json({message:"Internal Server Error"})
            }
}


export const sendFriendRequest = async (req,res) => {
   try {
    const myId = req.user.id
    
    const { id:recipientId } = req.params
    

    //prevent sending req to yourself
    if(myId === recipientId) return res.status(400).json({message: "You can't send friend request to yourself" })


    const recipient = await userModel.findById(recipientId)

    if(!recipient) return res.status(404).json({message: "Recipient not found"})

        // check if user is already friends
        if(recipient.friends.includes(myId)) return res.status(400).json({message:"You are already friends with this user"});

        // check if a request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId, recipient: recipientId},
                {sender:recipientId, recipient: myId},
            ],
        });

        if(existingRequest){
           return res.status(400).json({message:"A friend request already exists between you and this user"})
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        }) 
        console.log(friendRequest)
        return res.status(201).json(friendRequest)

   } catch (error) {
       console.log("Error in sendFriendRequest in user controller", error.message)
       return res.status(500).json({message:"Internal Server Error"})
   }
}


export const acceptFriendRequest = async (req,res) => {
        try {
            const {id:requestId} = req.params
            const friendRequest = await FriendRequest.findById(requestId);

            if(!friendRequest) return res.status(404).json({message:"Request not found"})

                // verify the current user is the owner

            if(friendRequest.recipient.toString() !== req.user.id){
                return res.status(403).json({message:"You are not authorized to accept this request"})

            }

            friendRequest.status = "accepted";
            await friendRequest.save()

            //add each users to others friends array
            //$addToSet add elements to an array only if they don't already exist
            await userModel.findByIdAndUpdate(friendRequest.sender, {
                $addToSet: {friends: friendRequest.recipient},
            })

            await userModel.findByIdAndUpdate(friendRequest.recipient, {
                $addToSet: {friends: friendRequest.sender},
            })

            res.status(200).json({message:"Friend Request Accepted"})

        } catch (error) {
            console.log("Error in acceptFriendRequest in user controller", error.message)
            res.status(500).json({message:"Internal Server Error"})
        }
}


export const getFriendrequest = async (req,res) => {
   
    try {
        const incomingReq = await FriendRequest.find({
            recipient: req.user.id,
            status:"pending",
        }).populate("sender", "fullname profilePic nativeLearning learningLanguage")
    
    
        const acceptedReq = await FriendRequest.find({
            sender: req.user.id,
            status:"accepted"
        }).populate("recipient", "fullname profilePic")
    
        res.status(200).json({incomingReq, acceptedReq})
    } catch (error) {
        console.log("Error in getFriendRequest in user controller", error.message)
        res.status(500).json({message:"Internal Server Error"})
    }

}



export const getOutgoingFriendrequest = async (req,res) => {
     try {
        const outgoingRequest = await FriendRequest.find({
            sender:req.user.id,
            status:"pending"
        }).populate("recipient", "fullname profilePic nativeLearning learningLanguage")

        res.status(200).json(outgoingRequest)
     } catch (error) {
        console.log("Error in getOutgoingFriendRequest in user controller", error.message)
        res.status(500).json({message:"Internal Server Error"})
     }
}