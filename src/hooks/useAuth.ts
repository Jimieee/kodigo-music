import { useEffect } from "react";
import {
  useAuthStore,
  useAuthUser,
  useIsAuthenticated,
  useAuthLoading,
} from "../store/authStore";
import type { SignUpData, SignInData, AuthResult } from "../types/auth";
import toast from "react-hot-toast";

export const useAuth = () => {
  const user = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();

  const {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    sendVerificationEmail,
    initializeAuth,
  } = useAuthStore();

  useEffect(() => {
    initializeAuth();

    return () => {
      const unsubscribe = window.__authUnsubscribe;
      if (unsubscribe) {
        unsubscribe();
        delete window.__authUnsubscribe;
      }
    };
  }, [initializeAuth]);

  const showToast = (result: AuthResult) => {
    if (result.success) {
      if (result.message) {
        toast.success(result.message.message);
      }
    } else {
      if (result.error) {
        toast.error(result.error.message);
      }
    }
  };

  const handleSignUp = async (data: SignUpData) => {
    const result = await signUp(data);
    showToast(result);
    return result;
  };

  const handleSignIn = async (data: SignInData) => {
    const result = await signIn(data);
    showToast(result);
    return result;
  };

  const handleSignInWithGoogle = async () => {
    const result = await signInWithGoogle();
    showToast(result);
    return result;
  };

  const handleSignOut = async () => {
    const result = await signOut();
    showToast(result);
    return result;
  };

  const handleResetPassword = async (email: string) => {
    const result = await resetPassword(email);
    showToast(result);
    return result;
  };

  const handleUpdateProfile = async (data: {
    displayName?: string;
    photoURL?: string;
  }) => {
    const result = await updateProfile(data);
    showToast(result);
    return result;
  };

  const handleSendVerificationEmail = async () => {
    const result = await sendVerificationEmail();
    showToast(result);
    return result;
  };

  return {
    user,
    isAuthenticated,
    isLoading,

    signUp: handleSignUp,
    signIn: handleSignIn,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updateProfile: handleUpdateProfile,
    sendVerificationEmail: handleSendVerificationEmail,

    signUpRaw: signUp,
    signInRaw: signIn,
    signInWithGoogleRaw: signInWithGoogle,
    signOutRaw: signOut,
    resetPasswordRaw: resetPassword,
    updateProfileRaw: updateProfile,
    sendVerificationEmailRaw: sendVerificationEmail,
  };
};