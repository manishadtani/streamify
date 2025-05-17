import React from 'react'
import { login } from '../lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const useLogin = () => {

    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser']})
      toast.success('Login successful')
      console.log('Before update =>', queryClient.getQueryData(['authUser']))
      queryClient.setQueryData(['authUser'], (oldData) => ({
        ...oldData,
        isLoggedIn: true,
      }))
      console.log('After update =>', queryClient.getQueryData(['authUser']))

      navigate('/');
      
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something smmmm wrong")
    }
  })


  return {isPending, error, loginMutation: mutate}
}

export default useLogin