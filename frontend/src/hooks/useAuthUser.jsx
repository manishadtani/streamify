import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api.js';

const useAuthUser = () => {
    const authUser = useQuery({
        queryKey:["authUser"],
        queryFn: getAuthUser,
        retry: false,
        refetchOnMount: true,
      });
      return {isLoading: authUser.isLoading, authUser:authUser.data?.user, error: authUser.error, isLoggedIn: !!authUser.data?.user};
}

export default useAuthUser