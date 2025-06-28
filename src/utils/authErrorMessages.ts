export interface UserFriendlyError {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

const AUTH_ERROR_MESSAGES: Record<string, UserFriendlyError> = {
  // Email/Password Authentication Errors
  'auth/user-not-found': {
    title: 'Account Not Found',
    message: 'No account exists with this email address. Would you like to create a new account?',
    type: 'error'
  },
  'auth/wrong-password': {
    title: 'Incorrect Password',
    message: 'The password you entered is incorrect. Please try again or reset your password.',
    type: 'error'
  },
  'auth/invalid-email': {
    title: 'Invalid Email',
    message: 'Please enter a valid email address.',
    type: 'error'
  },
  'auth/email-already-in-use': {
    title: 'Email Already Registered',
    message: 'An account with this email already exists. Try signing in instead.',
    type: 'error'
  },
  'auth/weak-password': {
    title: 'Password Too Weak',
    message: 'Please choose a stronger password with at least 8 characters.',
    type: 'error'
  },
  'auth/invalid-credential': {
    title: 'Invalid Credentials',
    message: 'The email or password you entered is incorrect. Please check and try again.',
    type: 'error'
  },
  
  // Google Sign-in Errors
  'auth/popup-closed-by-user': {
    title: 'Sign-in Cancelled',
    message: 'The sign-in process was cancelled. Please try again to continue.',
    type: 'warning'
  },
  'auth/popup-blocked': {
    title: 'Popup Blocked',
    message: 'Your browser blocked the sign-in popup. Please allow popups and try again.',
    type: 'error'
  },
  'auth/cancelled-popup-request': {
    title: 'Sign-in Interrupted',
    message: 'The sign-in was interrupted. Please try again.',
    type: 'warning'
  },
  'auth/account-exists-with-different-credential': {
    title: 'Account Exists',
    message: 'An account with this email already exists. Please sign in with your original method.',
    type: 'error'
  },
  
  // Network and Server Errors
  'auth/network-request-failed': {
    title: 'Connection Error',
    message: 'Unable to connect to our servers. Please check your internet connection and try again.',
    type: 'error'
  },
  'auth/too-many-requests': {
    title: 'Too Many Attempts',
    message: 'Too many failed attempts. Please wait a moment before trying again.',
    type: 'error'
  },
  'auth/operation-not-allowed': {
    title: 'Sign-in Method Disabled',
    message: 'This sign-in method is currently not available. Please try a different method.',
    type: 'error'
  },
  'auth/user-disabled': {
    title: 'Account Disabled',
    message: 'This account has been disabled. Please contact support for assistance.',
    type: 'error'
  },
  'auth/requires-recent-login': {
    title: 'Recent Login Required',
    message: 'For security reasons, please sign in again to continue.',
    type: 'warning'
  },
  'auth/user-token-expired': {
    title: 'Session Expired',
    message: 'Your session has expired. Please sign in again to continue.',
    type: 'warning'
  },
  'auth/invalid-action-code': {
    title: 'Invalid Reset Link',
    message: 'This password reset link is invalid or has expired. Please request a new one.',
    type: 'error'
  },
  'auth/expired-action-code': {
    title: 'Link Expired',
    message: 'This password reset link has expired. Please request a new one.',
    type: 'error'
  },
  
  // Profile Update Errors
  'auth/no-current-user': {
    title: 'Not Signed In',
    message: 'Please sign in to update your profile.',
    type: 'warning'
  },
  
  // Email Verification Errors
  'auth/email-already-verified': {
    title: 'Email Already Verified',
    message: 'Your email address is already verified.',
    type: 'info'
  },
  
  // Custom Application Errors
  'no-current-user': {
    title: 'Authentication Required',
    message: 'Please sign in to continue.',
    type: 'warning'
  },
  'unknown-error': {
    title: 'Unexpected Error',
    message: 'Something went wrong. Please try again or contact support if the problem persists.',
    type: 'error'
  }
};

const AUTH_SUCCESS_MESSAGES: Record<string, UserFriendlyError> = {
  signup: {
    title: 'Welcome to Kodigo Music!',
    message: 'Your account has been created successfully. Please check your email to verify your account.',
    type: 'info'
  },
  signin: {
    title: 'Welcome Back!',
    message: 'You have successfully signed in to Kodigo Music.',
    type: 'info'
  },
  'google-signin': {
    title: 'Welcome!',
    message: 'You have successfully signed in with Google.',
    type: 'info'
  },
  'password-reset': {
    title: 'Reset Email Sent',
    message: 'We have sent a password reset link to your email address.',
    type: 'info'
  },
  'email-verification': {
    title: 'Verification Email Sent',
    message: 'A verification email has been sent to your email address.',
    type: 'info'
  },
  'profile-update': {
    title: 'Profile Updated',
    message: 'Your profile has been updated successfully.',
    type: 'info'
  },
  signout: {
    title: 'Signed Out',
    message: 'You have been successfully signed out.',
    type: 'info'
  }
};

const DEFAULT_ERROR: UserFriendlyError = {
  title: 'Authentication Error',
  message: 'An unexpected error occurred during authentication. Please try again.',
  type: 'error'
};

const DEFAULT_SUCCESS: UserFriendlyError = {
  title: 'Success',
  message: 'Operation completed successfully.',
  type: 'info'
};

export const getAuthErrorMessage = (errorCode: string): UserFriendlyError => {
  return AUTH_ERROR_MESSAGES[errorCode] || DEFAULT_ERROR;
};

export const getAuthSuccessMessage = (action: string): UserFriendlyError => {
  return AUTH_SUCCESS_MESSAGES[action] || DEFAULT_SUCCESS;
};

export type AuthErrorCode = keyof typeof AUTH_ERROR_MESSAGES;
export type AuthSuccessAction = keyof typeof AUTH_SUCCESS_MESSAGES;