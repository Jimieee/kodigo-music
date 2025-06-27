import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  type User as FirebaseUser,
  type Unsubscribe,
} from "firebase/auth";
import { auth } from "../config/firebase";
import type {
  SignUpData,
  SignInData,
  AuthResult,
  AuthUser,
} from "../types/auth";
import { isFirebaseError, mapFirebaseUser } from "../types/auth";

const handleAuthError = (error: unknown): AuthResult => {
  if (isFirebaseError(error)) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }

  return {
    success: false,
    error: {
      code: "unknown-error",
      message: "An unknown error occurred",
    },
  };
};

const createSuccessResult = (firebaseUser: FirebaseUser): AuthResult => {
  return {
    success: true,
    user: mapFirebaseUser(firebaseUser),
  };
};

export const signUp = async (data: SignUpData): Promise<AuthResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    if (data.displayName) {
      await updateProfile(userCredential.user, {
        displayName: data.displayName,
      });
    }

    await sendEmailVerification(userCredential.user);

    return createSuccessResult(userCredential.user);
  } catch (error) {
    return handleAuthError(error);
  }
};

export const signIn = async (data: SignInData): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    return createSuccessResult(userCredential.user);
  } catch (error) {
    return handleAuthError(error);
  }
};

export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    return createSuccessResult(userCredential.user);
  } catch (error) {
    return handleAuthError(error);
  }
};

export const signOutUser = async (): Promise<AuthResult> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return handleAuthError(error);
  }
};

export const resetPassword = async (email: string): Promise<AuthResult> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return handleAuthError(error);
  }
};

export const updateUserProfile = async (data: {
  displayName?: string;
  photoURL?: string;
}): Promise<AuthResult> => {
  try {
    if (!auth.currentUser) {
      return {
        success: false,
        error: {
          code: "no-current-user",
          message: "No user is currently signed in",
        },
      };
    }

    await updateProfile(auth.currentUser, data);
    return createSuccessResult(auth.currentUser);
  } catch (error) {
    return handleAuthError(error);
  }
};

export const sendVerificationEmail = async (): Promise<AuthResult> => {
  try {
    if (!auth.currentUser) {
      return {
        success: false,
        error: {
          code: "no-current-user",
          message: "No user is currently signed in",
        },
      };
    }

    await sendEmailVerification(auth.currentUser);
    return { success: true };
  } catch (error) {
    return handleAuthError(error);
  }
};

export const getCurrentUser = (): AuthUser | null => {
  if (!auth.currentUser) return null;
  return mapFirebaseUser(auth.currentUser);
};

export const subscribeToAuthState = (
  callback: (user: AuthUser | null) => void
): Unsubscribe => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(mapFirebaseUser(firebaseUser));
    } else {
      callback(null);
    }
  });
};
