export interface JwtPayload {
  sub: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export interface RequestUser {
  id: string;
  role?: string;
}
