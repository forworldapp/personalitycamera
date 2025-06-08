import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import CameraViewport from "./camera-viewport";
import ResultSection from "./result-section";

interface AnalysisResult {
  id: string;
  predictedAge: number;
  futureAge: number;
  confidence: string;
  analysis: string;
  futureDescription: string;
  createdAt: string;
}

export default function CameraSection() {
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const analyzeImageMutation = useMutation({
    mutationFn: async (imageFile: File) => {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await apiRequest('POST', '/api/predict-age', formData);
      return response.json();
    },
    onSuccess: (data: AnalysisResult) => {
      setAnalysisResult(data);
      queryClient.invalidateQueries({ queryKey: ['/api/predictions'] });
      toast({
        title: "분석 완료!",
        description: `예측 나이: ${data.predictedAge}세`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      console.error('Analysis error:', error);
      toast({
        title: "분석 실패",
        description: "이미지 분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 720 },
          height: { ideal: 960 },
          facingMode: 'user'
        }
      });
      setStream(mediaStream);
      setCameraActive(true);
      setAnalysisResult(null); // Clear previous results
      setCapturedImage(null);
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "카메라 접근 실패",
        description: "카메라에 접근할 수 없습니다. 브라우저 설정을 확인해주세요.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = async () => {
    if (!stream) return;

    try {
      // Create canvas to capture frame
      const video = document.querySelector('video') as HTMLVideoElement;
      if (!video) return;

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) return;

      context.drawImage(video, 0, 0);
      
      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        setCapturedImage(canvas.toDataURL('image/jpeg'));
        stopCamera();
        
        // Analyze the image
        analyzeImageMutation.mutate(file);
      }, 'image/jpeg', 0.8);
      
    } catch (error) {
      console.error('Capture error:', error);
      toast({
        title: "촬영 실패",
        description: "사진 촬영 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const retakePhoto = () => {
    setAnalysisResult(null);
    setCapturedImage(null);
    startCamera();
  };

  if (analysisResult) {
    return (
      <ResultSection 
        result={analysisResult}
        capturedImage={capturedImage}
        onRetake={retakePhoto}
      />
    );
  }

  return (
    <section className="text-center space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">얼굴 나이 예측</h2>
        <p className="text-gray-600 text-sm">
          AI가 당신의 나이를 분석하고<br />20년 후 모습을 예측해드려요
        </p>
      </div>

      <CameraViewport 
        stream={stream}
        cameraActive={cameraActive}
        isAnalyzing={analyzeImageMutation.isPending}
      />

      {/* Camera Controls */}
      <div className="flex items-center justify-center space-x-6 py-4">
        {!cameraActive ? (
          <Button 
            onClick={startCamera}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="mr-2">📹</span>
            카메라 시작
          </Button>
        ) : (
          <>
            <Button 
              onClick={stopCamera}
              variant="outline"
              className="px-4 py-2 rounded-full"
            >
              <span className="mr-1">⏹️</span>
              정지
            </Button>
            
            <Button
              onClick={capturePhoto}
              disabled={analyzeImageMutation.isPending}
              className="w-16 h-16 bg-white border-4 border-primary rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed p-0"
            >
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-lg">📷</span>
              </div>
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
