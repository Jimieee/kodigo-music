import type { User as FirebaseUser } from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthMessage {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
}

export interface AuthError extends AuthMessage {
  code: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: AuthError;
  message?: AuthMessage;
}

export const mapFirebaseUser = (firebaseUser: FirebaseUser): AuthUser => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
  emailVerified: firebaseUser.emailVerified,
});

export function isFirebaseError(error: unknown): error is AuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as Record<string, unknown>).code === "string" &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}