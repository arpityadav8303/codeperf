import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../api/auth.api";
import { tokenStorage } from "../../../core/lib/tokenStorage";
import { useAuthStore } from "../store/authStore";
import type { LoginRequest, SignUpRequest, AuthResponse } from "../types/auth.types";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state: any) => state.setAuth);
  const authService = AuthService.getInstance();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (response) => {
      if (response.accessToken && response.refreshToken) {
        tokenStorage.setTokens(response.accessToken, response.refreshToken);
      }
      if (response.accessToken) {
        setAuth(response.accessToken);
      }
      navigate("/dashboard");
    },
  });
};

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state: any) => state.setAuth);
  const authService = AuthService.getInstance();

  return useMutation<AuthResponse, Error, SignUpRequest>({
    mutationFn: (credentials) => authService.register(credentials),
    onSuccess: (response) => {
      if (response.accessToken && response.refreshToken) {
        tokenStorage.setTokens(response.accessToken, response.refreshToken);
      }
      if (response.accessToken) {
        setAuth(response.accessToken);
      }
      navigate("/dashboard");
    },
  });
};