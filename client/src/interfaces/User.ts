export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
  role: string;
  isBanned: boolean;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  latitude: number;
  longitude: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}
