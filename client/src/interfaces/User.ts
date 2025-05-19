export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string | null;
  role: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  location: {
    x: number;
    y: number;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}
