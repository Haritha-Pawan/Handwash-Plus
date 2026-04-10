export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superAdmin' | 'admin' | 'user' | 'teacher' | 'student';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}
