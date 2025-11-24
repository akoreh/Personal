export interface JWTPayload {
  sub: string; //user id
  email: string;
  username: string;
  iat: number; // Issued at
  exp: number; // Expiration time
}
