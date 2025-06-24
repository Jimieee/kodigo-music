import { type FC } from 'react';
import { cn } from '../../utils/cn';
import { ExplicitBadge } from './ExplicitBadge';

interface MusicTitleProps {
  title: string;
  artist?: string;
  explicit?: boolean;
  explicitVariant?: 'default' | 'compact';
  layout?: 'vertical' | 'horizontal';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  enableArtistHover?: boolean;
}

export const MusicTitle: FC<MusicTitleProps> = ({
  title,
  artist,
  explicit,
  explicitVariant = 'default',
  layout = 'vertical',
  size = 'medium',
  className,
  enableArtistHover = false
}) => {
  const titleSizes = {
    small: 'text-sm',
    medium: 'text-sm font-semibold',
    large: 'text-xl font-bold'
  };

  const artistSizes = {
    small: 'text-xs',
    medium: 'text-xs',
    large: 'text-sm'
  };

  if (layout === 'horizontal') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'truncate leading-tight text-foreground',
            explicit ? 'w-[200px]' : 'w-[220px]',
            titleSizes[size]
          )}>
            {title}
          </h3>
          {artist && (
            <div className="flex items-center gap-1">
              <p className={cn(
                'truncate leading-tight text-muted-foreground',
                explicit ? 'w-[200px]' : 'w-[220px]',
                artistSizes[size],
                enableArtistHover && 'hover:underline transition-all duration-200 cursor-pointer'
              )}>
                {artist}
              </p>
              {explicit && (
                <ExplicitBadge variant={explicitVariant} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className={cn(
          'truncate leading-tight text-foreground',
          explicit ? 'w-[200px]' : 'w-[220px]',
          titleSizes[size]
        )}>
          {title}
        </h3>
        {explicit && layout === 'vertical' && (
          <ExplicitBadge variant={explicitVariant} />
        )}
      </div>
      {artist && (
        <p className={cn(
          'truncate leading-tight text-muted-foreground',
          explicit ? 'w-[200px]' : 'w-[220px]',
          artistSizes[size],
          enableArtistHover && 'hover:underline transition-all duration-200 cursor-pointer'
        )}>
          {artist}
        </p>
      )}
    </div>
  );
};