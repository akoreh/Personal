export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export interface DecodedAuthToken extends AuthTokenPayload {
  iat: number;
  exp: number;
}
