import { useEffect } from "react";
import {
  useAuthStore,
  useAuthUser,
  useIsAuthenticated,
  useAuthLoading,
} from "../store/authStore";
import type { SignUpData, SignInData } from "../types/auth";
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

  const handleSignUp = async (data: SignUpData) => {
    const result = await signUp(data);

    if (result.success) {
      toast.success(
        "Account created successfully! Please check your email for verification."
      );
    } else {
      toast.error(result.error?.message || "Failed to create account");
    }

    return result;
  };

  const handleSignIn = async (data: SignInData) => {
    const result = await signIn(data);

    if (result.success) {
      toast.success("Welcome back!");
    } else {
      toast.error(result.error?.message || "Failed to sign in");
    }

    return result;
  };

  const handleSignInWithGoogle = async () => {
    const result = await signInWithGoogle();

    if (result.success) {
      toast.success("Welcome!");
    } else {
      toast.error(result.error?.message || "Failed to sign in with Google");
    }

    return result;
  };

  const handleSignOut = async () => {
    const result = await signOut();

    if (result.success) {
      toast.success("Signed out successfully");
    } else {
      toast.error(result.error?.message || "Failed to sign out");
    }

    return result;
  };

  const handleResetPassword = async (email: string) => {
    const result = await resetPassword(email);

    if (result.success) {
      toast.success("Password reset email sent! Check your inbox.");
    } else {
      toast.error(result.error?.message || "Failed to send reset email");
    }

    return result;
  };

  const handleUpdateProfile = async (data: {
    displayName?: string;
    photoURL?: string;
  }) => {
    const result = await updateProfile(data);

    if (result.success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(result.error?.message || "Failed to update profile");
    }

    return result;
  };

  const handleSendVerificationEmail = async () => {
    const result = await sendVerificationEmail();

    if (result.success) {
      toast.success("Verification email sent! Check your inbox.");
    } else {
      toast.error(result.error?.message || "Failed to send verification email");
    }

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
