import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  id: string;
  predictedAge: number;
  futureAge: number;
  confidence: string;
  analysis: string;
  futureDescription: string;
  createdAt: string;
}

interface ResultSectionProps {
  result: AnalysisResult;
  capturedImage: string | null;
  onRetake: () => void;
}

export default function ResultSection({ result, capturedImage, onRetake }: ResultSectionProps) {
  const { toast } = useToast();

  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Age AI 분석 결과',
          text: `AI가 예측한 나이: ${result.predictedAge}세, 20년 후: ${result.futureAge}세`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Sharing failed:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `AI가 예측한 나이: ${result.predictedAge}세, 20년 후: ${result.futureAge}세`;
      navigator.clipboard.writeText(text).then(() => {
        toast({
          title: "복사 완료",
          description: "결과가 클립보드에 복사되었습니다.",
        });
      }).catch(() => {
        toast({
          title: "공유 실패",
          description: "결과를 공유할 수 없습니다.",
          variant: "destructive",
        });
      });
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getConfidenceText = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return confidence;
    }
  };

  return (
    <section className="space-y-4">
      {/* Captured Image */}
      {capturedImage && (
        <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl mx-4" style={{ aspectRatio: '3/4' }}>
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            분석 완료
          </div>
        </div>
      )}

      <Card className="bg-white rounded-2xl shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-center text-gray-900">분석 결과</h3>
          
          {/* Current Analysis */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">현재 예측 나이</span>
              <div className="flex items-center space-x-1">
                <span className="text-xs">✨</span>
                <span className="text-xs text-primary font-medium">AI 분석</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <span className="text-3xl font-bold text-primary">{result.predictedAge}세</span>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xs text-gray-500">신뢰도:</span>
                <span className={`text-xs font-medium ${getConfidenceColor(result.confidence)}`}>
                  {getConfidenceText(result.confidence)}
                </span>
              </div>
              {result.analysis && (
                <p className="text-sm text-gray-600 mt-2">{result.analysis}</p>
              )}
            </div>
          </div>

          {/* Future Prediction */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">20년 후 예상 모습</span>
              <span className="text-purple-500">🔮</span>
            </div>
            <div className="text-center space-y-3">
              {/* Future Image Visualization */}
              <div className="relative w-32 h-32 mx-auto">
                {capturedImage ? (
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-purple-200">
                    <img 
                      src={capturedImage} 
                      alt="Future prediction" 
                      className="w-full h-full object-cover"
                    />
                    {/* Aging overlay effects */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Subtle aging overlay */}
                      <svg className="w-full h-full" viewBox="0 0 128 128">
                        {/* Wrinkle lines around eyes */}
                        <path 
                          d="M32 40 Q35 42 38 40 M32 44 Q35 46 38 44 M90 40 Q93 42 96 40 M90 44 Q93 46 96 44" 
                          stroke="rgba(139, 69, 19, 0.3)" 
                          strokeWidth="0.5" 
                          fill="none"
                        />
                        {/* Mouth lines */}
                        <path 
                          d="M45 75 Q50 78 55 75 M73 75 Q78 78 83 75" 
                          stroke="rgba(139, 69, 19, 0.2)" 
                          strokeWidth="0.5" 
                          fill="none"
                        />
                        {/* Forehead lines */}
                        <path 
                          d="M40 28 Q64 25 88 28 M42 32 Q64 29 86 32" 
                          stroke="rgba(139, 69, 19, 0.2)" 
                          strokeWidth="0.5" 
                          fill="none"
                        />
                        {/* Gray hair effect */}
                        <circle cx="45" cy="20" r="1" fill="rgba(192, 192, 192, 0.4)" />
                        <circle cx="55" cy="18" r="1" fill="rgba(192, 192, 192, 0.4)" />
                        <circle cx="65" cy="19" r="1" fill="rgba(192, 192, 192, 0.4)" />
                        <circle cx="75" cy="21" r="1" fill="rgba(192, 192, 192, 0.4)" />
                        <circle cx="83" cy="20" r="1" fill="rgba(192, 192, 192, 0.4)" />
                      </svg>
                    </div>
                    {/* Age indicator badge */}
                    <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      +20년
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-2xl">👤</span>
                  </div>
                )}
              </div>
              
              <div>
                <span className="text-2xl font-bold text-purple-600">{result.futureAge}세</span>
                <p className="text-sm text-gray-600">예상 모습입니다</p>
              </div>
              
              {result.futureDescription && (
                <div className="bg-white/50 rounded-lg p-3 mt-3">
                  <p className="text-sm text-gray-700 leading-relaxed">{result.futureDescription}</p>
                </div>
              )}
              
              {/* Aging indicators */}
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mt-3">
                <div className="text-center">
                  <div className="w-6 h-6 bg-gray-200 rounded-full mx-auto mb-1 flex items-center justify-center">
                    👴
                  </div>
                  <span>피부 변화</span>
                </div>
                <div className="text-center">
                  <div className="w-6 h-6 bg-gray-200 rounded-full mx-auto mb-1 flex items-center justify-center">
                    🎭
                  </div>
                  <span>주름 형성</span>
                </div>
                <div className="text-center">
                  <div className="w-6 h-6 bg-gray-200 rounded-full mx-auto mb-1 flex items-center justify-center">
                    ⚪
                  </div>
                  <span>모발 변화</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button 
              onClick={shareResult}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors"
            >
              <span className="mr-2">📤</span>
              공유하기
            </Button>
            <Button 
              onClick={onRetake}
              variant="outline"
              className="flex-1 py-3 rounded-xl font-medium"
            >
              <span className="mr-2">🔄</span>
              다시 촬영
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
