import { MusicImage } from '../ui/MusicImage';
import { useMusicCard } from '../../hooks/useMusicCard';
import { cn } from '../../utils/cn';
import type { FC } from 'react';
import type { MusicCardData } from '../../types/music';

const CarouselMusicCard: FC<MusicCardData> = ({
  label,
  title,
  subtitle,
  description,
  imageUrl,
  imageAlt,
  onClick,
  className
}) => {
  const { handleClick } = useMusicCard({ onClick });

  return (
    <article
      className={cn('w-full cursor-pointer', className)}
      onClick={handleClick}
    >
      <header className="mb-3">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
          {label}
        </p>
        <h2 className="text-white text-xl font-bold mb-1">{title}</h2>
        <p className="text-gray-300 text-sm">{subtitle}</p>
      </header>

      <figure className="relative w-full rounded-lg overflow-hidden group">
        <MusicImage
          src={imageUrl}
          alt={imageAlt}
          size="large"
          overlay
        />

        {description && (
          <figcaption className="absolute bottom-4 left-4 right-4 z-10">
            <p className="text-white text-sm leading-relaxed">{description}</p>
          </figcaption>
        )}
      </figure>
    </article>
  );
};

export default CarouselMusicCard;