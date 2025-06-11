import { motion, AnimatePresence } from "framer-motion";

interface CameraFlashProps {
  isVisible: boolean;
  onComplete: () => void;
}

export default function CameraFlash({ isVisible, onComplete }: CameraFlashProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.3,
            times: [0, 0.1, 1],
            ease: "easeInOut"
          }}
          className="fixed inset-0 bg-white z-50 pointer-events-none"
          onAnimationComplete={onComplete}
        />
      )}
    </AnimatePresence>
  );
}