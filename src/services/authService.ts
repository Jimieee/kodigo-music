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
import {
  getAuthErrorMessage,
  getAuthSuccessMessage,
} from "../utils/authErrorMessages";

const handleAuthError = (error: unknown): AuthResult => {
  if (isFirebaseError(error)) {
    const friendlyError = getAuthErrorMessage(error.code);
    return {
      success: false,
      error: {
        code: error.code,
        message: friendlyError.message,
        title: friendlyError.title,
        type: friendlyError.type,
      },
    };
  }

  const unknownError = getAuthErrorMessage("unknown-error");
  return {
    success: false,
    error: {
      code: "unknown-error",
      message: unknownError.message,
      title: unknownError.title,
      type: unknownError.type,
    },
  };
};

const createSuccessResult = (
  firebaseUser: FirebaseUser,
  action?: string
): AuthResult => {
  const result: AuthResult = {
    success: true,
    user: mapFirebaseUser(firebaseUser),
  };

  if (action) {
    const successMessage = getAuthSuccessMessage(action);
    result.message = {
      title: successMessage.title,
      message: successMessage.message,
      type: successMessage.type,
    };
  }

  return result;
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

    return createSuccessResult(userCredential.user, "signup");
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

    return createSuccessResult(userCredential.user, "signin");
  } catch (error) {
    return handleAuthError(error);
  }
};

export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const provider = new GoogleAuthProvider();

    const userCredential = await signInWithPopup(auth, provider);

    return createSuccessResult(userCredential.user, "google-signin");
  } catch (error) {
    return handleAuthError(error);
  }
};

export const signOutUser = async (): Promise<AuthResult> => {
  try {
    await signOut(auth);
    const successMessage = getAuthSuccessMessage("signout");
    return {
      success: true,
      message: {
        title: successMessage.title,
        message: successMessage.message,
        type: successMessage.type,
      },
    };
  } catch (error) {
    return handleAuthError(error);
  }
};

export const resetPassword = async (email: string): Promise<AuthResult> => {
  try {
    await sendPasswordResetEmail(auth, email);
    const successMessage = getAuthSuccessMessage("password-reset");
    return {
      success: true,
      message: {
        title: successMessage.title,
        message: successMessage.message,
        type: successMessage.type,
      },
    };
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
      const noUserError = getAuthErrorMessage("no-current-user");
      return {
        success: false,
        error: {
          code: "no-current-user",
          message: noUserError.message,
          title: noUserError.title,
          type: noUserError.type,
        },
      };
    }

    await updateProfile(auth.currentUser, data);
    return createSuccessResult(auth.currentUser, "profile-update");
  } catch (error) {
    return handleAuthError(error);
  }
};

export const sendVerificationEmail = async (): Promise<AuthResult> => {
  try {
    if (!auth.currentUser) {
      const noUserError = getAuthErrorMessage("no-current-user");
      return {
        success: false,
        error: {
          code: "no-current-user",
          message: noUserError.message,
          title: noUserError.title,
          type: noUserError.type,
        },
      };
    }

    await sendEmailVerification(auth.currentUser);
    const successMessage = getAuthSuccessMessage("email-verification");
    return {
      success: true,
      message: {
        title: successMessage.title,
        message: successMessage.message,
        type: successMessage.type,
      },
    };
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
