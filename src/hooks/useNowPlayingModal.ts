import { useState, useCallback } from "react";

export interface UseNowPlayingModalReturn {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

{/* TODO: consolidate modal handling into a single hook (useModal) */}
export const useNowPlayingModal = (): UseNowPlayingModalReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  return {
    isModalOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};
