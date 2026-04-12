import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/auth.api";
import { saveAuthToken, saveAuthUser } from "../../../../lib/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      const token =
        response?.data?.tokens?.accessToken ||
        response?.tokens?.accessToken ||
        response?.data?.accessToken ||
        response?.accessToken ||
        response?.token;
      const user = response?.data?.user || response?.user;

      if (token) {
        saveAuthToken(token);
      }
      if (user) {
        saveAuthUser(user);
      }
    },
  });
};
