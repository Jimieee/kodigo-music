import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { FC } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { FaGoogle } from 'react-icons/fa';

interface SignInFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

interface SignInFormProps {
  onSuccess: () => void;
}

type FormMode = 'signin' | 'signup' | 'reset';

export const SignInForm: FC<SignInFormProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<FormMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUp, signIn, signInWithGoogle, resetPassword, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<SignInFormData>({
    mode: 'onBlur'
  });

  const password = watch('password');

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0, y: 0.6 }
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 1, y: 0.6 }
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4']
      });
    }, 200);
  };

  const onSubmit = async (data: SignInFormData) => {
    try {
      let result;

      if (mode === 'signin') {
        result = await signIn({
          email: data.email,
          password: data.password,
        });
      } else if (mode === 'signup') {
        const displayName = data.firstName && data.lastName
          ? `${data.firstName} ${data.lastName}`
          : data.firstName || '';

        result = await signUp({
          email: data.email,
          password: data.password,
          displayName,
        });
      } else if (mode === 'reset') {
        result = await resetPassword(data.email);
        if (result.success) {
          setMode('signin');
          reset();
        }
        return;
      }

      if (result?.success) {
        launchConfetti();
        onSuccess();
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    const result = await signInWithGoogle();
    if (result.success) {
      launchConfetti();
      onSuccess();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const switchMode = (newMode: FormMode) => {
    setMode(newMode);
    reset();
  };

  const getFormTitle = () => {
    switch (mode) {
      case 'signin': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'reset': return 'Reset Password';
      default: return 'Sign In';
    }
  };

  const getSubmitButtonText = () => {
    if (isLoading) {
      switch (mode) {
        case 'signin': return 'Signing in...';
        case 'signup': return 'Creating account...';
        case 'reset': return 'Sending email...';
        default: return 'Loading...';
      }
    }

    switch (mode) {
      case 'signin': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'reset': return 'Send Reset Email';
      default: return 'Submit';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {getFormTitle()}
        </h2>
        <p className="text-sm text-muted-foreground">
          {mode === 'signin' && 'Welcome back to Kodigo Music'}
          {mode === 'signup' && 'Join Kodigo Music today'}
          {mode === 'reset' && 'Enter your email to reset your password'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mode === 'signup' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-foreground mb-2"
              >
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Your first name"
                  className="pl-10"
                  {...register('firstName', {
                    required: mode === 'signup' ? 'First name is required' : false,
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters'
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message: 'Only letters and spaces are allowed'
                    }
                  })}
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Your last name"
                  className="pl-10"
                  {...register('lastName', {
                    required: mode === 'signup' ? 'Last name is required' : false,
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters'
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                      message: 'Only letters and spaces are allowed'
                    }
                  })}
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="pl-10"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {mode !== 'reset' && (
          <>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  className="pl-10 pr-10"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: mode === 'signup' ? {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    } : undefined,
                    pattern: mode === 'signup' ? {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message: 'Must contain at least: 1 uppercase, 1 lowercase, 1 number and 1 symbol'
                    } : undefined
                  })}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Campo de confirmación de contraseña solo en modo signup */}
            {mode === 'signup' && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === password || 'Passwords do not match'
                    })}
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {getSubmitButtonText()}
            </div>
          ) : (
            getSubmitButtonText()
          )}
        </Button>

        {mode !== 'reset' && (
          <Button
            type="button"
            size="lg"
            className="w-full cursor-pointer hover:bg-primary/80"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <FaGoogle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium tracking-wide">Continue with Google</span>
          </Button>
        )}

        <div className="text-center text-sm space-y-2">
          {mode === 'signin' && (
            <>
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-primary hover:text-primary/80 font-medium cursor-pointer"
                >
                  Sign up
                </button>
              </p>
              <p className="text-muted-foreground">
                Forgot your password?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-primary hover:text-primary/80 font-medium cursor-pointer"
                >
                  Reset it
                </button>
              </p>
            </>
          )}

          {mode === 'signup' && (
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-primary hover:text-primary/80 font-medium cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}

          {mode === 'reset' && (
            <p className="text-muted-foreground">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-primary hover:text-primary/80 font-medium cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};