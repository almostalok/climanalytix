import { AuthService, User } from '../../types/auth';

const STORAGE_KEY = 'ca_auth_session';

export class MockAuthService implements AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.currentUser = parsed.user;
        this.token = parsed.token;
      }
    } catch {
      // Fallback
    }
  }

  async signIn(email: string, _password: string): Promise<User> {
    // Artificial slight latency to demonstrate realistic auth state
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid work or institutional email address.');
    }

    const user: User = {
      id: 'usr_lokesh_upreti',
      email: email || 'lokesh.upreti@howdengroup.com',
      name: 'Lokesh Upreti',
      role: 'Lead Scientist',
      organization: 'Howden Climate Intelligence',
    };

    this.currentUser = user;
    this.token = 'mock_jwt_' + Math.random().toString(36).substring(2);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: this.currentUser,
        token: this.token,
      })
    );

    return user;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const authService = new MockAuthService();
