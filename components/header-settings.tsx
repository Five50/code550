"use client";

import { useEffect } from 'react';
import { useHeader } from '@/lib/header-context';

interface HeaderSettingsProps {
  isFixedPosition?: boolean;
}

export function HeaderSettings({ isFixedPosition = false }: HeaderSettingsProps) {
  const { setIsFixedPosition } = useHeader();

  useEffect(() => {
    setIsFixedPosition(isFixedPosition);

    // Cleanup when component unmounts
    return () => {
      setIsFixedPosition(false);
    };
  }, [isFixedPosition, setIsFixedPosition]);

  return null; // This component doesn't render anything
}