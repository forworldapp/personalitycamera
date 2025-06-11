import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, StopCircle, RotateCcw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import CameraViewport from "./camera-viewport";
import PersonalityLoading from "./personality-loading";
import QuickCaptureFeedback from "./quick-capture-feedback";
import { useHaptics } from "@/hooks/useHaptics";

interface PersonalityResult {
  id: string;
  mbtiType: string;
  confidence: string;
  traits: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  analysis: { ko: string; en: string };
  strengths: { ko: string; en: string };
  weaknesses: { ko: string; en: string };
  recommendations: { ko: string; en: string };
  createdAt: string;
}

interface PersonalityCameraProps {
  onAnalysisComplete: (result: PersonalityResult, image: string) => void;
}

export default function PersonalityCamera({ onAnalysisComplete }: PersonalityCameraProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const [showLoading, setShowLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const analyzePersonality = useMutation({
    mutationFn: async (imageFile: File): Promise<PersonalityResult> => {
      setShowLoading(true);
      console.log('Created file:', imageFile.name, imageFile.size, imageFile.type);
      console.log('Starting personality analysis with file:', imageFile.name, imageFile.size, imageFile.type);
      
      const formData = new FormData();
      formData.append('image', imageFile);
      
      console.log('FormData entries:');
      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(key, value);
      });
      
      const response = await fetch('/api/analyze-personality', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for authentication
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data: PersonalityResult) => {
      console.log('Analysis complete:', data);
      setShowLoading(false);
      if (capturedImage) {
        onAnalysisComplete(data, capturedImage);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/analyses'] });
    },
    onError: (error) => {
      console.error('Analysis failed:', error);
      setShowLoading(false);
      toast({
        title: "분석 실패",
        description: "성격 분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user'
        }
      });
      setStream(mediaStream);
      setCameraActive(true);
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
      setCameraActive(false);
    }
  };

  const capturePhoto = async () => {
    if (!stream) return;

    try {
      // Create canvas to capture frame using the same logic as working camera
      const video = document.querySelector('video') as HTMLVideoElement;
      if (!video) {
        toast({
          title: "촬영 실패",
          description: "비디오 요소를 찾을 수 없습니다.",
          variant: "destructive",
        });
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) {
        toast({
          title: "촬영 실패",
          description: "Canvas 컨텍스트를 생성할 수 없습니다.",
          variant: "destructive",
        });
        return;
      }

      context.drawImage(video, 0, 0);
      
      // Convert to blob and file
      return new Promise<void>((resolve, reject) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            toast({
              title: "촬영 실패",
              description: "이미지 생성에 실패했습니다.",
              variant: "destructive",
            });
            reject(new Error('Failed to create blob'));
            return;
          }
          
          try {
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            console.log('Created file:', file.name, file.size, file.type);
            
            setCapturedImage(canvas.toDataURL('image/jpeg'));
            stopCamera();
            
            // Analyze the image
            analyzePersonality.mutate(file);
            resolve();
          } catch (error) {
            console.error('File creation error:', error);
            toast({
              title: "촬영 실패",
              description: "파일 생성 중 오류가 발생했습니다.",
              variant: "destructive",
            });
            reject(error);
          }
        }, 'image/jpeg', 0.9);
      });
      
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
    setCapturedImage(null);
    startCamera();
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="space-y-4">
      {/* Language Toggle */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
          <Button
            variant={language === 'ko' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setLanguage('ko')}
            className="rounded-full"
          >
            한국어
          </Button>
          <Button
            variant={language === 'en' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setLanguage('en')}
            className="rounded-full"
          >
            English
          </Button>
        </div>
      </div>

      {/* Camera Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-gray-800">
            {language === 'ko' ? '성격 분석' : 'Personality Analysis'}
          </span>
          <span className="text-purple-500">🧠</span>
        </div>

        <CameraViewport 
          stream={stream} 
          cameraActive={cameraActive} 
          isAnalyzing={analyzePersonality.isPending} 
        />

        <canvas ref={canvasRef} className="hidden" />

        {/* Camera Controls */}
        <div className="flex justify-center space-x-3 mt-4">
          {!cameraActive && (
            <Button
              onClick={startCamera}
              className="bg-purple-500 hover:bg-purple-600 text-white"
              disabled={analyzePersonality.isPending}
            >
              <Camera className="w-4 h-4 mr-2" />
              {language === 'ko' ? '카메라 시작' : 'Start Camera'}
            </Button>
          )}

          {cameraActive && (
            <>
              <Button
                onClick={capturePhoto}
                className="bg-green-500 hover:bg-green-600 text-white px-8"
                disabled={analyzePersonality.isPending}
              >
                <Camera className="w-4 h-4 mr-2" />
                {language === 'ko' ? '촬영하기' : 'Capture'}
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                disabled={analyzePersonality.isPending}
              >
                <StopCircle className="w-4 h-4 mr-2" />
                {language === 'ko' ? '정지' : 'Stop'}
              </Button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-3">
          {language === 'ko' 
            ? '얼굴 표정과 특징으로 성격을 분석합니다' 
            : 'Analyze personality through facial expressions and features'
          }
        </p>
      </div>

      {/* Personality Loading Modal */}
      <PersonalityLoading 
        isVisible={showLoading}
        onComplete={() => setShowLoading(false)}
      />
    </div>
  );
}