import type { FC } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../common/Loading';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  requireEmailVerification?: boolean;
}

export const AuthGuard: FC<AuthGuardProps> = ({
  children,
  fallback,
  requireAuth = true,
  requireEmailVerification = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (requireAuth && !isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  if (requireEmailVerification && user && !user.emailVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification Required</h2>
        <p className="text-gray-600 mb-4">
          Please verify your email address to continue.
        </p>
        <p className="text-sm text-gray-500">
          Check your inbox for a verification email.
        </p>
      </div>
    );
  }

  if (!requireAuth && isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};