export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Analyst' | 'Lead Scientist' | 'Administrator';
  organization: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export interface AuthService {
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): User | null;
  getToken(): string | null;
}
