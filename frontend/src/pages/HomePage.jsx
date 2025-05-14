import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getOutGoingFriendRequests, getRecomendedUsers, getUserFriends, sendFriendRequest } from '../lib/api'
import { Link } from 'react-router-dom'
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react'
import NoFriendsFound from '../components/NoFriendsFound'
import FriendCard, { getLanguageFlag } from '../components/FriendCard'
import toast from 'react-hot-toast'
import { capitialize } from '../lib/utils'
const HomePage = () => {

  const queryClient = useQueryClient()
  const [outGoingRequestIds, setOutGoingRequestIds] = useState(new Set())

  console.log(outGoingRequestIds)


  const {data:friends=[], isLoading:loadingFriends} = useQuery({
      queryKey:["friends"],
      queryFn: getUserFriends,
  })

  const {data:recomendedUsers=[], isLoading:loadingUsers} = useQuery({
    queryKey:["users"],
    queryFn: getRecomendedUsers,
   }) 

  const {data:outGoingFriendRequests=[], isLoading:loadingoutGoingRequests} = useQuery({
  queryKey:["outGoingFriendRequests"],
  queryFn: getOutGoingFriendRequests,
  })




const { mutate: sendRequestMutation, isPending } = useMutation({
 
  mutationFn: sendFriendRequest,
  onSuccess: () => {queryClient.invalidateQueries({ queryKey: ["outGoingFriendRequests"] });
  toast.success("Friend request sent successfully!");
},

onError: (error) => {
  console.log(error)
  toast.error(error?.response?.data?.message || "Failed to send friend request");

}

});

useEffect(() => {
  const outgoingIds = new Set();
  if (outGoingFriendRequests && outGoingFriendRequests.length > 0) {
    console.log(outGoingFriendRequests)
    outGoingFriendRequests.forEach((req) => {
      outgoingIds.add(req.recipient._id);
    });
    setOutGoingRequestIds(outgoingIds);
  }
}, [outGoingFriendRequests]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
    <div className="container mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
        <Link to="/notifications" className="btn btn-outline btn-sm">
          <UsersIcon className="mr-2 size-4" />
          Friend Requests
        </Link>
      </div>


  
      {loadingFriends ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      )}





      <section>
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
              <p className="opacity-70">
                Discover perfect language exchange partners based on your profile
              </p>
            </div>
          </div>
        </div>

        {loadingUsers ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : recomendedUsers.length === 0 ? (
          <div className="card bg-base-200 p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
            <p className="text-base-content opacity-70">
              Check back later for new language partners!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recomendedUsers.map((user) => {
              const hasRequestBeenSent = outGoingRequestIds.has(user._id);

              return (
                <div
                  key={user._id}
                  className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="card-body p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar size-16 rounded-full">
                        <img src={user.profilePic} alt={user.fullname} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">{user.fullname}</h3>
                        {user.location && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <MapPinIcon className="size-3 mr-1" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Languages with flags */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="badge badge-secondary">
                        {getLanguageFlag(user.nativeLanguage)}
                        Native: {capitialize(user.nativeLanguage)}
                      </span>
                      <span className="badge badge-outline">
                        {getLanguageFlag(user.learningLanguage)}
                        Learning: {capitialize(user.learningLanguage)}
                      </span>
                    </div>

                    {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                    {/* Action button */}
                    <button
                      className={`btn w-full mt-2 ${
                        hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                      } `}
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={hasRequestBeenSent || isPending}
                    >
                      {hasRequestBeenSent ? (
                        <>
                          <CheckCircleIcon className="size-4 mr-2" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="size-4 mr-2" />
                          Send Friend Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>    
        )}
      </section>
    </div>
  </div>
  )
}

export default HomePage

