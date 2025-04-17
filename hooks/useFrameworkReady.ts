import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void | Promise<void>;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    const handleFrameworkReady = async () => {
      try {
        if (window.frameworkReady) {
          await window.frameworkReady();
        }
      } catch (error) {
        console.error('Framework ready handler failed:', error);
      }
    };

    handleFrameworkReady();
  }, []);
}