import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser'
import {
  Channel,
  Chat,
  MessageList,
  MessageInput,
  ChannelHeader,
  Thread,
  Window
} from 'stream-chat-react'
import { getStreamToken } from '../lib/api'
import { useQuery } from '@tanstack/react-query'
import { StreamChat } from 'stream-chat'
import toast from 'react-hot-toast'
import ChatLoader from '../components/ChatLoader'
import CallButton from '../components/CallButton'

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const chatPage = () => {

  const {id:targetUserId} = useParams()

  const [chatClient, setChatClient] = useState(null)
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)

  const {authUser} = useAuthUser()
  const {data:tokenData} = useQuery({
    queryKey:["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser
  })
                         
  useEffect(() => {
    const initChat = async () => {
        if(!tokenData?.token || !authUser) return
      console.log("Token Data:", tokenData);

        try {
            console.log("Initializing chat...")
            const client = StreamChat.getInstance(STREAM_API_KEY)  
            await client.connectUser({
              id: authUser._id.toString(),
              name: authUser.fullname,
              image: authUser.profilePic || ""
            }, tokenData.token)  

            const channelId = [authUser._id, targetUserId].sort().join("_")
            const currentChannel = client.channel("messaging", channelId, {
              members: [authUser._id, targetUserId]
            })
            await currentChannel.watch()
            setChatClient(client)
            setChannel(currentChannel)
            
            
          } catch (error) {
            console.log("Error initializing chat:", error)
            toast.error("Failed to initialize chat")
        }
        finally{
          setLoading(false)
        }
    }

      initChat()
  } , [tokenData, authUser, targetUserId])

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };


  if(loading || !chatClient || !channel) return <ChatLoader /> 

  return (
      <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default chatPage