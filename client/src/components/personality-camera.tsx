import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, StopCircle, RotateCcw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const analyzePersonality = useMutation({
    mutationFn: async (imageFile: File): Promise<PersonalityResult> => {
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
      if (capturedImage) {
        onAnalysisComplete(data, capturedImage);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/analyses'] });
    },
    onError: (error) => {
      console.error('Analysis failed:', error);
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
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 1280 }
        },
        audio: false
      });
      
      setStream(mediaStream);
      setCameraActive(true);
      setCapturedImage(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('카메라 접근 실패:', error);
      toast({
        title: "카메라 오류",
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

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);

    // Convert to file for upload
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        analyzePersonality.mutate(file);
      }
    }, 'image/jpeg', 0.8);

    stopCamera();
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

        <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl mx-4" style={{ aspectRatio: '3/4' }}>
          {cameraActive && stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-b from-gray-800 to-gray-900">
              <div className="w-20 h-20 border-4 border-dashed border-gray-400 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-gray-400">📷</span>
              </div>
              <p className="text-gray-300 text-center px-6">
                {language === 'ko' ? '카메라를 시작하여\n얼굴을 촬영해주세요' : 'Start camera to\ncapture your face'}
              </p>
            </div>
          )}

          {/* Face Detection Overlay */}
          {cameraActive && !analyzePersonality.isPending && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-56 border-2 border-purple-400/60 rounded-2xl transition-opacity duration-300">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-purple-400 rounded-tl-lg"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-purple-400 rounded-tr-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-purple-400 rounded-bl-lg"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-purple-400 rounded-br-lg"></div>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {analyzePersonality.isPending && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300">
              <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white font-medium">
                {language === 'ko' ? 'AI가 분석 중...' : 'AI analyzing...'}
              </p>
              <p className="text-gray-300 text-sm mt-1">
                {language === 'ko' ? '잠시만 기다려주세요' : 'Please wait a moment'}
              </p>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Camera Controls */}
        <div className="flex justify-center space-x-3 mt-4">
          {!cameraActive && !capturedImage && (
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
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={analyzePersonality.isPending}
              >
                <Camera className="w-4 h-4 mr-2" />
                {language === 'ko' ? '촬영' : 'Capture'}
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

          {capturedImage && !analyzePersonality.isPending && (
            <Button
              onClick={retakePhoto}
              variant="outline"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {language === 'ko' ? '다시 촬영' : 'Retake'}
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-3">
          {language === 'ko' 
            ? '얼굴 표정과 특징으로 성격을 분석합니다' 
            : 'Analyze personality through facial expressions and features'
          }
        </p>
      </div>
    </div>
  );
}