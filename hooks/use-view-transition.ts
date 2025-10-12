'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

// Type for the View Transition API
type ViewTransition = {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
};

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
};

export function useViewTransition() {
  const router = useRouter();

  const navigate = useCallback((url: string) => {
    // Check if the browser supports view transitions
    const doc = document as DocumentWithViewTransition;
    if (typeof document !== 'undefined' && doc.startViewTransition) {
      doc.startViewTransition(() => {
        router.push(url);
      });
    } else {
      // Fallback for browsers that don't support view transitions
      router.push(url);
    }
  }, [router]);

  const replace = useCallback((url: string) => {
    const doc = document as DocumentWithViewTransition;
    if (typeof document !== 'undefined' && doc.startViewTransition) {
      doc.startViewTransition(() => {
        router.replace(url);
      });
    } else {
      router.replace(url);
    }
  }, [router]);

  const back = useCallback(() => {
    const doc = document as DocumentWithViewTransition;
    if (typeof document !== 'undefined' && doc.startViewTransition) {
      doc.startViewTransition(() => {
        router.back();
      });
    } else {
      router.back();
    }
  }, [router]);

  const forward = useCallback(() => {
    const doc = document as DocumentWithViewTransition;
    if (typeof document !== 'undefined' && doc.startViewTransition) {
      doc.startViewTransition(() => {
        router.forward();
      });
    } else {
      router.forward();
    }
  }, [router]);

  const refresh = useCallback(() => {
    const doc = document as DocumentWithViewTransition;
    if (typeof document !== 'undefined' && doc.startViewTransition) {
      doc.startViewTransition(() => {
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
  const doc = document as DocumentWithViewTransition;
  if (typeof document !== 'undefined' && doc.startViewTransition) {
    return doc.startViewTransition(callback);
  } else {
    // For browsers that don't support view transitions, just call the callback
    return Promise.resolve(callback());
  }
}