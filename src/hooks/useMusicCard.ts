import { useCallback } from "react";

interface UseMusicCardProps {
  onClick?: () => void;
  onPlay?: () => void;
  onMore?: () => void;
}

export const useMusicCard = ({
  onClick,
  onPlay,
  onMore,
}: UseMusicCardProps = {}) => {
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const handlePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onPlay?.();
    },
    [onPlay]
  );

  const handleMore = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onMore?.();
    },
    [onMore]
  );

  return {
    handleClick,
    handlePlay,
    handleMore,
  };
};
