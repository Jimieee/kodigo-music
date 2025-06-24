import React, { type CSSProperties } from 'react';
import { cn } from '../../utils/cn';
import { useViewTransitionState } from 'react-router-dom';

interface MusicImageProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large' | 'square';
  className?: string;
  overlay?: boolean;
  rounded?: boolean;
  songId?: string;
  enableTransition?: boolean;
  style?: CSSProperties;
}

export const MusicImage: React.FC<MusicImageProps> = ({
  src,
  alt,
  size = 'medium',
  className,
  overlay = false,
  rounded = true,
  songId,
  enableTransition = false,
  style = {}
}) => {
  const isTransitioning = useViewTransitionState(`/song/${songId}`);

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-full h-full',
    large: 'w-full h-full',
    square: 'aspect-square w-full h-full'
  };

  return (
    <div className={cn(
      'relative overflow-hidden',
      rounded && 'rounded-lg',
      sizeClasses[size],
      className
    )}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          viewTransitionName: enableTransition && isTransitioning && songId
            ? `song-image-${songId}`
            : 'none',
          contain: 'layout',
          ...style
        }}
      />
      {overlay && (
        <span
          aria-hidden
          className="absolute inset-0 bg-black/10"
        />
      )}
    </div>
  );
};