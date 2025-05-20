import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { signup } from '../lib/api'
import toast from 'react-hot-toast'

const useSignup = () => {
    const queryClient = useQueryClient()
    
      const {mutate, isPending, error} = useMutation({
        mutationFn: signup,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey : ["authUser"]})
        toast.success('Signup successful')
        navigate('/onboarding');
        },
    
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Something went wrong");
        }
      })
    
      return {isPending, error, signupMutation:mutate}
}

export default useSignup