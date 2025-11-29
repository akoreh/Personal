export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export interface DecodedAuthToken extends AuthTokenPayload {
  iat: number;
  exp: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}
