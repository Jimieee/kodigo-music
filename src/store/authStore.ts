import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  AuthState,
  AuthUser,
  SignUpData,
  SignInData,
  AuthResult,
} from "../types/auth";
import * as authService from "../services/authService";

interface AuthActions {
  signUp: (data: SignUpData) => Promise<AuthResult>;
  signIn: (data: SignInData) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updateProfile: (data: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<AuthResult>;
  sendVerificationEmail: () => Promise<AuthResult>;
  initializeAuth: () => void;
  setUser: (user: AuthUser | null) => void;
  setLoading: (isLoading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,

    signUp: async (data: SignUpData): Promise<AuthResult> => {
      set({ isLoading: true });
      const result = await authService.signUp(data);

      if (result.success && result.user) {
        set({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }

      return result;
    },

    signIn: async (data: SignInData): Promise<AuthResult> => {
      set({ isLoading: true });
      const result = await authService.signIn(data);

      if (result.success && result.user) {
        set({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }

      return result;
    },

    signInWithGoogle: async (): Promise<AuthResult> => {
      set({ isLoading: true });
      const result = await authService.signInWithGoogle();

      if (result.success && result.user) {
        set({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }

      return result;
    },

    signOut: async (): Promise<AuthResult> => {
      set({ isLoading: true });
      const result = await authService.signOutUser();

      if (result.success) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }

      return result;
    },

    resetPassword: async (email: string): Promise<AuthResult> => {
      return await authService.resetPassword(email);
    },

    updateProfile: async (data: {
      displayName?: string;
      photoURL?: string;
    }): Promise<AuthResult> => {
      const result = await authService.updateUserProfile(data);

      if (result.success && result.user) {
        set({ user: result.user });
      }

      return result;
    },

    sendVerificationEmail: async (): Promise<AuthResult> => {
      return await authService.sendVerificationEmail();
    },

    initializeAuth: () => {
      set({ isLoading: true });

      const unsubscribe = authService.subscribeToAuthState((user) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      });

      window.__authUnsubscribe = unsubscribe;
    },

    setUser: (user: AuthUser | null) => {
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    },

    setLoading: (isLoading: boolean) => {
      set({ isLoading });
    },
  }))
);

export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
