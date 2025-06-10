
import type { User as FirebaseUser } from 'firebase/auth';
import type React from 'react';

export interface SignUpCredentials {
  email: string;
  password?: string; // Optional for social logins in future
  confirmPassword?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string; // Optional for social logins in future
}

export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signUp: (credentials: SignUpCredentials) => Promise<FirebaseUser | null>;
  login: (credentials: LoginCredentials) => Promise<FirebaseUser | null>;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
