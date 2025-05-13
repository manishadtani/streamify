import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { logout } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending, error } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] }), 
      navigate('/signup');
    }
  });

  return { logoutMutation: mutate, isPending, error };
}

export default useLogout