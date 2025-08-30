import { useState } from 'react';

interface Practice {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  benefits: string[];
  instructions: string[];
  moduleId?: string;
  frameworkId?: string;
}

interface UsePracticeSessionReturn {
  isModalOpen: boolean;
  currentPractice: Practice | null;
  startPractice: (practice: Practice) => void;
  closeModal: () => void;
}

export function usePracticeSession(): UsePracticeSessionReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPractice, setCurrentPractice] = useState<Practice | null>(null);

  const startPractice = (practice: Practice) => {
    setCurrentPractice(practice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPractice(null);
  };

  return {
    isModalOpen,
    currentPractice,
    startPractice,
    closeModal,
  };
} 