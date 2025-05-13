import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { completeOnBoarding } from '../lib/api.js'
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react'
import { LANGUAGES } from '../constants/index.js'
import toast from 'react-hot-toast'
import PageLoader from '../components/pageLoader.jsx'
import { useNavigate } from 'react-router'

const OnBoardingPage = () => {
  const { isLoading, authUser } = useAuthUser()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formState, setFormState] = useState({
    fullname: authUser?.fullname || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  })

  const { mutate: onBoardingMutation, isPending } = useMutation({
    mutationFn: completeOnBoarding,
    onSuccess: (updatedUser) => {
      console.log(updatedUser)
      console.log('Before update =>', queryClient.getQueryData(['authUser']))
      toast.success('Profile onboarding successful')
      queryClient.setQueryData(['authUser'], (oldData) => ({
        ...oldData,
        ...updatedUser,
        isOnboarded: true,
      }))
      console.log('After update =>', queryClient.getQueryData(['authUser']))

      navigate('/');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong")
    }
  })

  const handleOnBoarding = (e) => {
    e.preventDefault()
    const { fullname, bio, nativeLanguage, learningLanguage, location } = formState
    if (!fullname || !bio || !nativeLanguage || !learningLanguage || !location) {
      return toast.error("Please fill all required fields")
    }
    onBoardingMutation(formState)
  }

  const handleRandomAvatar = () => {
    const randomIdx = Math.floor(Math.random() * 100) + 1
    const randomAvatar = `https://avatar.iran.liara.run/public/${randomIdx}.png`
    setFormState({ ...formState, profilePic: randomAvatar })
    toast.success("Random profile picture generated")
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-2xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>
          <form onSubmit={handleOnBoarding} className="space-y-6">

            {/* Profile Image */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                value={formState.fullname}
                onChange={(e) => setFormState({ ...formState, fullname: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Submit */}
            <button className="btn btn-primary w-full" disabled={isPending}>
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnBoardingPage
