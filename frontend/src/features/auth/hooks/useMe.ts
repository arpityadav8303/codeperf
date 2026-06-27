import { useQuery } from "@tanstack/react-query";
import { AuthService } from "../api/auth.api";

export const useMe = () => {
  const authService = AuthService.getInstance();

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await authService.getMe();
      // Unwrapping envelope structures safely
      if (response && response.success === false) {
        throw new Error(response.message || "Failed to retrieve user session");
      }
      return response; 
    },
    staleTime: 1000 * 60 * 5, // Mark data fresh for 5 minutes
    retry: false,            // Don't retry infinitely on auth failures
  });
};