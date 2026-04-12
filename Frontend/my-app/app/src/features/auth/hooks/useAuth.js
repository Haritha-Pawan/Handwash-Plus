import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/auth.api";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      if (response.success) {
        localStorage.setItem("token", response.data.tokens.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    },
  });
};
