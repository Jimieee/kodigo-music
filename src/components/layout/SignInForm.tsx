import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import type { FC } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface SignInFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface SignInFormProps {
  onSuccess: () => void;
}

export const SignInForm: FC<SignInFormProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
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
    setIsLoading(true);

    try {
      const loadingToast = toast.loading('Creating your account...', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151'
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Registration data:', data);

      toast.dismiss(loadingToast);

      launchConfetti();

      toast.success(`Welcome to Kodigo Music, ${data.firstName}! 🎵`, {
        duration: 4000,
        style: {
          background: '#065f46',
          color: '#fff',
          border: '1px solid #059669'
        },
        icon: '🎉'
      });

      onSuccess();
    } catch (error: unknown) {
      console.error(error);

      toast.error('Registration failed. Please try again.', {
        duration: 4000,
        style: {
          background: '#7f1d1d',
          color: '#fff',
          border: '1px solid #dc2626'
        }
      });

      setError('root', {
        message: 'Error registering user. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                required: 'First name is required',
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
                required: 'Last name is required',
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
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Must contain at least: 1 uppercase, 1 lowercase, 1 number and 1 symbol'
              }
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

      {errors.root && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
          <p className="text-sm text-red-400">
            {errors.root.message}
          </p>
        </div>
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
            Creating account...
          </div>
        ) : (
          'Create Account'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Button
          variant="ghost"
          type="button"
          onClick={() => {
            console.log('Switch to login');
          }}
          className="text-primary hover:text-primary/80 hover:bg-secondary/0 transition-colors font-medium cursor-pointer"
        >
          Sign in
        </Button>
      </p>
    </form>
  );
};