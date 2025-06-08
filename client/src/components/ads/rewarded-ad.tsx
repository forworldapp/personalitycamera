import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Play, CheckCircle } from "lucide-react";

interface RewardedAdProps {
  isVisible: boolean;
  onClose: () => void;
  onRewardEarned: () => void;
  rewardText?: string;
}

export default function RewardedAd({ 
  isVisible, 
  onClose, 
  onRewardEarned,
  rewardText = "무료 분석 1회 추가"
}: RewardedAdProps) {
  const [adState, setAdState] = useState<'offer' | 'playing' | 'completed'>('offer');
  const [watchProgress, setWatchProgress] = useState(0);

  const startAd = () => {
    setAdState('playing');
    setWatchProgress(0);
    
    // Simulate ad watching progress
    const interval = setInterval(() => {
      setWatchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAdState('completed');
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const claimReward = () => {
    onRewardEarned();
    onClose();
    setAdState('offer');
    setWatchProgress(0);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm w-full mx-4">
        {adState === 'offer' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
              <Gift className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">보상 받기</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                짧은 광고를 시청하고<br />
                <span className="font-medium text-purple-600">{rewardText}</span>를 받으세요
              </p>
            </div>

            <div className="space-y-2">
              <Button onClick={startAd} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                <Play className="w-4 h-4 mr-2" />
                광고 시청하기
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full">
                나중에
              </Button>
            </div>
          </div>
        )}

        {adState === 'playing' && (
          <div className="text-center space-y-4">
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-3xl mb-2">📺</div>
                <div>보상형 광고</div>
                <div className="text-xs mt-1">320x240</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>진행률</span>
                <span>{Math.round(watchProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-150"
                  style={{ width: `${watchProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {adState === 'completed' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">보상 획득!</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                <span className="font-medium text-green-600">{rewardText}</span>가<br />
                계정에 추가되었습니다
              </p>
            </div>

            <Button onClick={claimReward} className="w-full bg-green-600 hover:bg-green-700">
              보상 받기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}