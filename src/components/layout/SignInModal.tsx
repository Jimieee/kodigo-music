import { X } from 'lucide-react';
import type { FC } from 'react';
import { SignInForm } from './SignInForm';
import { Button } from '../ui/Button';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: FC<SignInModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-md mx-4 bg-card rounded-lg shadow-2xl border border-border animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Kodigo Music
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <SignInForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};