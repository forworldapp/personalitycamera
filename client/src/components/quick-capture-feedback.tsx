import { motion } from "framer-motion";
import { Camera, CheckCircle } from "lucide-react";

interface QuickCaptureFeedbackProps {
  isVisible: boolean;
  onComplete: () => void;
}

export default function QuickCaptureFeedback({ isVisible, onComplete }: QuickCaptureFeedbackProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
      onAnimationComplete={() => {
        setTimeout(onComplete, 1500);
      }}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl max-w-xs mx-4"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-semibold text-gray-900 mb-2"
          >
            사진 촬영 완료!
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-600"
          >
            AI 분석을 시작합니다...
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}