import { Home, Plus, Radio } from 'lucide-react';
import { useState, type FC, type ReactNode } from 'react';
import type { NavigationItem } from '../../types/navigation';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useNowPlayingModal } from '../../hooks/useNowPlayingModal';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileTopBar from './MobileTopBar';
import MobileSidebar from './MobileSidebar';
import FloatBar from './FloatBar';
import { NowPlayingModal } from './NowPlayingModal';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { usePlayerStore } from '../../store/playerStore';
import type { CurrentSong } from '../../types/music';
import { calculateProgress } from '../../utils/time';
import { ROUTES } from '../../router/routes';

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  useAudioPlayer();
  const {
    isPlaying,
    currentSong,
    volume,
    currentTime,
    duration,
    togglePlayPause,
    setVolume,
    seekTo,
    nextSong,
    previousSong
  } = usePlayerStore();
  const { isMobile } = useBreakpoint();
  const { isModalOpen, openModal, closeModal } = useNowPlayingModal();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const progress = calculateProgress(currentTime, duration);

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      icon: <Home className="h-4 w-4" />,
      label: 'Home',
      path: ROUTES.HOME,
    },
    {
      id: 'new',
      icon: <Plus className="h-4 w-4" />,
      label: 'New',
      path: '/new',
    },
    {
      id: 'radio',
      icon: <Radio className="h-4 w-4" />,
      label: 'Radio',
      path: '/radio',
    },
  ];

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const currentSongFormatted: CurrentSong | undefined = currentSong ? {
    id: currentSong.id,
    title: currentSong.title,
    artist: currentSong.artist,
    artistId: currentSong.artistId,
    imageUrl: currentSong.imageUrl,
    imageAlt: currentSong.imageAlt,
    duration: duration,
    currentTime: currentTime
  } : undefined;

  const commonModalProps = {
    currentSong: currentSongFormatted,
    isPlaying,
    onTogglePlay: togglePlayPause,
    volume,
    onVolumeChange: setVolume,
    progress,
    onSeek: seekTo,
    duration,
    currentTime,
    onNext: nextSong,
    onPrevious: previousSong,
  };

  if (isMobile) {
    return (
      <div className="h-screen bg-background text-foreground flex flex-col relative">
        <MobileTopBar
          onMenuToggle={handleMobileMenuToggle}
        />
        <MobileSidebar
          navigationItems={navigationItems}
          isMobile={isMobileMenuOpen}
          onItemClick={handleMobileMenuClose}
        />
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
          <div className="h-20" />
        </main>
        <FloatBar
          onTogglePlay={togglePlayPause}
          onNowPlayingClick={openModal}
          isPlaying={isPlaying}
          currentSong={currentSongFormatted}
          onNext={nextSong}
          onPrevious={previousSong}
        />
        <NowPlayingModal
          isOpen={isModalOpen}
          onClose={closeModal}
          {...commonModalProps}
        />
      </div>
    );
  }

  return (
    <article className="h-screen bg-background text-foreground flex">
      <Sidebar navigationItems={navigationItems} />
      <section className="flex flex-col flex-1 min-w-0">
        <TopBar
          onTogglePlay={togglePlayPause}
          onNext={nextSong}
          onPrevious={previousSong}
          isPlaying={isPlaying}
          volume={volume}
          onVolumeChange={setVolume}
          currentSong={currentSongFormatted}
          onNowPlayingClick={openModal}
          progress={progress}
        />
        <main className="flex-1 overflow-auto">
          <div className="min-h-full flex flex-col">
            <div className="flex-1">
              {children || <Outlet />}
            </div>
            <Footer />
          </div>
        </main>
      </section>
      <NowPlayingModal
        isOpen={isModalOpen}
        onClose={closeModal}
        {...commonModalProps}
      />
    </article>
  );
};