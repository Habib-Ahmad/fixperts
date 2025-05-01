export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  role: string;
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
