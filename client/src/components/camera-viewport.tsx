import { useEffect, useRef } from "react";

interface CameraViewportProps {
  stream: MediaStream | null;
  cameraActive: boolean;
  isAnalyzing: boolean;
}

export default function CameraViewport({ stream, cameraActive, isAnalyzing }: CameraViewportProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl mx-4" style={{ aspectRatio: '3/4' }}>
      {/* Camera Preview */}
      {cameraActive && stream ? (
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay 
          muted 
          playsInline
        />
      ) : (
        /* Camera Placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="w-20 h-20 border-4 border-dashed border-gray-400 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl text-gray-400">📷</span>
          </div>
          <p className="text-gray-300 text-center px-6">
            카메라를 시작하여<br />얼굴을 촬영해주세요
          </p>
        </div>
      )}

      {/* Face Detection Overlay */}
      {cameraActive && !isAnalyzing && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-56 border-2 border-primary/60 rounded-2xl transition-opacity duration-300">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg"></div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white font-medium">AI가 분석 중...</p>
          <p className="text-gray-300 text-sm mt-1">잠시만 기다려주세요</p>
        </div>
      )}
    </div>
  );
}
