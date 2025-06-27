import { useEffect, useRef, useState, type FC } from "react";
import { Button } from "../ui/Button";
import { ChevronDown, LogOut, Mail, User } from 'lucide-react';
import { cn } from "../../utils/cn";
import { useAuth } from "../../hooks/useAuth";
import { useSignInModal } from "../../hooks/useSignInModal";
import { SignInModal } from "./SignInModal";

interface UserProfileProps {
  variant?: 'desktop' | 'mobile';
  showDropdownIcon?: boolean;
  className?: string;
}

const UserProfile: FC<UserProfileProps> = ({
  variant = 'desktop',
  showDropdownIcon = true,
  className
}) => {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const { isModalOpen, openModal, closeModal } = useSignInModal();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'Usuario';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    return getInitials(displayName);
  };

  if (isLoading && !isModalOpen) {
    return (
      <div className={cn(
        variant === 'mobile' ? "w-10 h-10" : "w-20 h-8",
        "bg-muted animate-pulse rounded-md",
        className
      )} />
    );
  }

  if (isAuthenticated && user) {
    return (
      <>
        <div className={cn("relative", className)} ref={dropdownRef}>
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "flex items-center transition-all duration-200 hover:bg-secondary/60 cursor-pointer group",
              variant === 'mobile'
                ? "w-10 h-10 p-0 rounded-lg justify-center"
                : "space-x-2 px-3 py-2 rounded-lg",
              isDropdownOpen && "bg-secondary/80"
            )}
            aria-label="User menu"
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={getUserDisplayName()}
                className={cn(
                  "rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-200",
                  variant === 'mobile' ? "w-6 h-6" : "w-8 h-8"
                )}
              />
            ) : (
              <div className={cn(
                "rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-200",
                variant === 'mobile' ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm"
              )}>
                {getUserInitials()}
              </div>
            )}
            {showDropdownIcon && variant === 'desktop' && (
              <ChevronDown className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200 hidden sm:block",
                isDropdownOpen && "rotate-180"
              )} />
            )}
          </Button>

          {isDropdownOpen && (
            <div className={cn(
              "absolute top-full mt-2 w-72 bg-card border border-border rounded-lg shadow-xl shadow-black/20 z-50 overflow-hidden",
              variant === 'mobile' ? "right-0" : "right-0"
            )}>
              <div className="p-4 border-b border-border bg-secondary/30">
                <div className="flex items-center space-x-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={getUserDisplayName()}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                      {getUserInitials()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-muted-foreground truncate flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full cursor-pointer px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200 flex items-center space-x-3"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          )}
        </div>
        <SignInModal isOpen={isModalOpen} onClose={closeModal} />
      </>
    );
  }

  return (
    <>
      <Button
        className={cn(
          "cursor-pointer hover:scale-105 transition-all duration-200",
          variant === 'mobile' && "w-10 h-10 p-0",
          className
        )}
        variant="primary"
        size="sm"
        onClick={openModal}
      >
        <User className={cn(
          "h-4 w-4",
          variant === 'desktop' && "mr-2"
        )} aria-hidden="true" />
        {variant === 'desktop' && "Sign In"}
      </Button>
      <SignInModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default UserProfile;