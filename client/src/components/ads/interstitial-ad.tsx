import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface InterstitialAdProps {
  isVisible: boolean;
  onClose: () => void;
  onAdCompleted?: () => void;
}

export default function InterstitialAd({ isVisible, onClose, onAdCompleted }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setCountdown(5);
      setCanClose(false);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanClose(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    if (canClose) {
      onClose();
      onAdCompleted?.();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm w-full mx-4 relative">
        {/* Close button - only visible after countdown */}
        {canClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-2 right-2 w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {/* Ad Content Area */}
        <div className="text-center space-y-4">
          <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-2xl mb-2">📺</div>
              <div className="text-sm">전면 광고</div>
              <div className="text-xs mt-1">320x240</div>
            </div>
          </div>

          {!canClose && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              광고가 {countdown}초 후에 닫힙니다
            </div>
          )}

          {canClose && (
            <Button onClick={handleClose} className="w-full">
              계속하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}