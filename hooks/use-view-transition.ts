'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

// Type for the View Transition API
declare global {
  interface Document {
    startViewTransition?: (callback: () => void | Promise<void>) => {
      finished: Promise<void>;
      ready: Promise<void>;
      updateCallbackDone: Promise<void>;
    };
  }
}

export function useViewTransition() {
  const router = useRouter();

  const navigate = useCallback((url: string) => {
    // Check if the browser supports view transitions
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(url);
      });
    } else {
      // Fallback for browsers that don't support view transitions
      router.push(url);
    }
  }, [router]);

  const replace = useCallback((url: string) => {
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => {
        router.replace(url);
      });
    } else {
      router.replace(url);
    }
  }, [router]);

  const back = useCallback(() => {
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => {
        router.back();
      });
    } else {
      router.back();
    }
  }, [router]);

  const forward = useCallback(() => {
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => {
        router.forward();
      });
    } else {
      router.forward();
    }
  }, [router]);

  const refresh = useCallback(() => {
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => {
        router.refresh();
      });
    } else {
      router.refresh();
    }
  }, [router]);

  return {
    navigate,
    replace,
    back,
    forward,
    refresh,
    isSupported: typeof document !== 'undefined' && 'startViewTransition' in document
  };
}

// Higher-order function to wrap any navigation function with view transitions
export function withViewTransition(callback: () => void | Promise<void>) {
  if (typeof document !== 'undefined' && document.startViewTransition) {
    return document.startViewTransition(callback);
  } else {
    // For browsers that don't support view transitions, just call the callback
    return Promise.resolve(callback());
  }
}