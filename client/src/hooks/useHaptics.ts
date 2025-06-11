import { useCallback } from 'react';
import { usePlatform } from './usePlatform';

interface HapticsAPI {
  impact: (style?: 'light' | 'medium' | 'heavy') => Promise<void>;
  notification: (type?: 'success' | 'warning' | 'error') => Promise<void>;
  selection: () => Promise<void>;
}

export function useHaptics(): HapticsAPI {
  const { isCapacitor } = usePlatform();

  const impact = useCallback(async (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (isCapacitor) {
      try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        const styleMap = {
          light: ImpactStyle.Light,
          medium: ImpactStyle.Medium,
          heavy: ImpactStyle.Heavy,
        };
        await Haptics.impact({ style: styleMap[style] });
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
  }, [isCapacitor]);

  const notification = useCallback(async (type: 'success' | 'warning' | 'error' = 'success') => {
    if (isCapacitor) {
      try {
        const { Haptics, NotificationType } = await import('@capacitor/haptics');
        const typeMap = {
          success: NotificationType.Success,
          warning: NotificationType.Warning,
          error: NotificationType.Error,
        };
        await Haptics.notification({ type: typeMap[type] });
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
  }, [isCapacitor]);

  const selection = useCallback(async () => {
    if (isCapacitor) {
      try {
        const { Haptics } = await import('@capacitor/haptics');
        await Haptics.selectionStart();
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
  }, [isCapacitor]);

  return {
    impact,
    notification,
    selection,
  };
}