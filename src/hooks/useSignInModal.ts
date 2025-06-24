import { useState } from 'react';

{/* TODO: consolidate modal handling into a single hook (useModal) */}
export const useSignInModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  return {
    isModalOpen,
    openModal,
    closeModal
  };
};