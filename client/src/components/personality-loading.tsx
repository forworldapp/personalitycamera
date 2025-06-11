import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Eye, Heart, Zap, Target, Users } from "lucide-react";

interface PersonalityLoadingProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const personalitySteps = [
  {
    icon: Eye,
    label: { ko: "얼굴 특징 분석", en: "Analyzing facial features" },
    color: "from-blue-500 to-blue-600",
    duration: 2000,
  },
  {
    icon: Brain,
    label: { ko: "AI 성격 모델링", en: "AI personality modeling" },
    color: "from-purple-500 to-purple-600",
    duration: 2500,
  },
  {
    icon: Heart,
    label: { ko: "감정 패턴 인식", en: "Emotion pattern recognition" },
    color: "from-pink-500 to-pink-600",
    duration: 2200,
  },
  {
    icon: Target,
    label: { ko: "MBTI 유형 예측", en: "MBTI type prediction" },
    color: "from-green-500 to-green-600",
    duration: 1800,
  },
  {
    icon: Users,
    label: { ko: "성격 특성 매핑", en: "Personality trait mapping" },
    color: "from-orange-500 to-orange-600",
    duration: 2000,
  },
  {
    icon: Zap,
    label: { ko: "최종 결과 생성", en: "Generating final results" },
    color: "from-yellow-500 to-yellow-600",
    duration: 1500,
  },
];

export default function PersonalityLoading({ isVisible, onComplete }: PersonalityLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [language] = useState<'ko' | 'en'>('ko');
  const [stepProgress, setStepProgress] = useState<number[]>(new Array(personalitySteps.length).fill(0));

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
      setStepProgress(new Array(personalitySteps.length).fill(0));
      return;
    }

    let stepIndex = 0;
    let totalProgress = 0;
    const totalDuration = personalitySteps.reduce((sum, step) => sum + step.duration, 0);

    const runStep = () => {
      if (stepIndex >= personalitySteps.length) {
        setProgress(100);
        setTimeout(() => {
          onComplete?.();
        }, 500);
        return;
      }

      const step = personalitySteps[stepIndex];
      setCurrentStep(stepIndex);
      
      let stepStartTime = Date.now();
      let stepProgressValue = 0;

      const updateProgress = () => {
        const elapsed = Date.now() - stepStartTime;
        stepProgressValue = Math.min((elapsed / step.duration) * 100, 100);
        
        setStepProgress(prev => {
          const newProgress = [...prev];
          newProgress[stepIndex] = stepProgressValue;
          return newProgress;
        });

        // Calculate total progress
        const completedStepsProgress = stepIndex * (100 / personalitySteps.length);
        const currentStepProgress = (stepProgressValue / 100) * (100 / personalitySteps.length);
        totalProgress = completedStepsProgress + currentStepProgress;
        setProgress(totalProgress);

        if (stepProgressValue < 100) {
          requestAnimationFrame(updateProgress);
        } else {
          stepIndex++;
          setTimeout(runStep, 300);
        }
      };

      updateProgress();
    };

    runStep();
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'ko' ? 'AI 성격 분석 중...' : 'AI Personality Analysis...'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ko' ? '잠시만 기다려주세요' : 'Please wait a moment'}
              </p>
            </div>

            {/* Overall Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">
                  {language === 'ko' ? '전체 진행률' : 'Overall Progress'}
                </span>
                <span className="font-semibold text-purple-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Step Progress */}
            <div className="space-y-4">
              {personalitySteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = stepProgress[index] === 100;
                const isUpcoming = index > currentStep;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-purple-50 border border-purple-200' 
                        : isCompleted 
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 text-white'
                        : isActive 
                          ? `bg-gradient-to-r ${step.color} text-white`
                          : isUpcoming
                            ? 'bg-gray-200 text-gray-400'
                            : 'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 text-white"
                        >
                          ✓
                        </motion.div>
                      ) : (
                        <motion.div
                          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-medium truncate ${
                          isActive ? 'text-purple-700' : isCompleted ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {step.label[language]}
                        </p>
                        {isActive && (
                          <span className="text-xs text-purple-600 font-semibold">
                            {Math.round(stepProgress[index])}%
                          </span>
                        )}
                      </div>
                      
                      {(isActive || isCompleted) && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${
                              isCompleted ? 'from-green-500 to-green-600' : step.color
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${stepProgress[index]}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {language === 'ko' 
                  ? 'AI가 당신의 성격을 분석하고 있습니다' 
                  : 'AI is analyzing your personality'
                }
              </p>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex justify-center space-x-1 mt-2"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ 
                      duration: 0.6, 
                      repeat: Infinity, 
                      delay: i * 0.2 
                    }}
                    className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}