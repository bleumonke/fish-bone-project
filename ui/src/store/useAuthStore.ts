import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  fullName: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,

      fetchUserProfile: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const res = await fetch('http://localhost:8080/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            throw new Error('Failed to fetch user profile');
          }

          const userData = await res.json();

          // Assuming API returns { email, full_name } keys
          set({
            user: {
              email: userData.email,
              fullName: userData.full_name,
            },
          });
        } catch (err) {
          // On failure, clear user and token
          set({ user: null, token: null });
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const formData = new URLSearchParams();
          formData.append('username', email);
          formData.append('password', password);

          const res = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || 'Login failed');
          }

          const data = await res.json();

          set({ token: data.access_token, user: null, loading: false });

          // Now fetch full user profile
          await get().fetchUserProfile();
        } catch (err: any) {
          set({ error: err.message || 'Login failed', loading: false });
        }
      },

      signup: async (fullName, email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch('http://localhost:8080/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: fullName, email, password }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || 'Signup failed');
          }

          // Auto-login after successful signup
          await get().login(email, password);
          set({ loading: false });
        } catch (err: any) {
          set({ error: err.message || 'Signup failed', loading: false });
        }
      },

      logout: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
