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

          {/* Before & After Comparison */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">현재 vs 20년 후</span>
              <span className="text-purple-500">🔮</span>
            </div>
            {/* Large comparison images */}
            <div className="space-y-4 mb-4">
              {/* Current Image - Large */}
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center justify-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  현재 모습 ({result.predictedAge}세)
                </h4>
                <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border-3 border-blue-200 shadow-lg">
                  {capturedImage ? (
                    <img 
                      src={capturedImage} 
                      alt="Current" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center">
                      <span className="text-blue-400 text-4xl">👤</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow down */}
              <div className="flex justify-center">
                <div className="text-3xl text-purple-400 transform rotate-90">→</div>
              </div>

              {/* Future Image - Large with dramatic effects */}
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center justify-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  20년 후 예상 모습 ({result.futureAge}세)
                </h4>
                <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border-3 border-purple-200 shadow-lg">
                  {capturedImage ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={capturedImage} 
                        alt="Future prediction" 
                        className="w-full h-full object-cover"
                      />
                      {/* More dramatic aging effects */}
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Aging color filter */}
                        <div className="absolute inset-0 bg-gradient-to-b from-yellow-100/20 via-amber-100/15 to-orange-100/25 mix-blend-multiply"></div>
                        
                        {/* Skin tone adjustment */}
                        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-yellow-200/15 mix-blend-soft-light"></div>
                        
                        {/* Dramatic aging overlay */}
                        <svg className="w-full h-full" viewBox="0 0 192 192">
                          {/* Eye wrinkles */}
                          <path 
                            d="M45 60 Q50 65 55 60 M45 65 Q50 70 55 65 M45 70 Q50 75 55 70 M137 60 Q142 65 147 60 M137 65 Q142 70 147 65 M137 70 Q142 75 147 70" 
                            stroke="rgba(101, 67, 33, 0.6)" 
                            strokeWidth="1.5" 
                            fill="none"
                          />
                          {/* Forehead wrinkles */}
                          <path 
                            d="M55 40 Q96 35 137 40 M58 45 Q96 40 134 45 M60 50 Q96 45 132 50" 
                            stroke="rgba(101, 67, 33, 0.5)" 
                            strokeWidth="1.2" 
                            fill="none"
                          />
                          {/* Smile lines and mouth area */}
                          <path 
                            d="M60 110 Q75 120 90 110 Q105 120 132 110 M65 125 Q80 130 95 125 Q110 130 127 125" 
                            stroke="rgba(101, 67, 33, 0.45)" 
                            strokeWidth="1" 
                            fill="none"
                          />
                          {/* Neck wrinkles */}
                          <path 
                            d="M70 160 Q96 155 122 160 M72 170 Q96 165 120 170 M74 180 Q96 175 118 180" 
                            stroke="rgba(101, 67, 33, 0.4)" 
                            strokeWidth="1" 
                            fill="none"
                          />
                          {/* Gray hair areas */}
                          <circle cx="65" cy="30" r="6" fill="rgba(210, 210, 210, 0.7)" />
                          <circle cx="80" cy="25" r="5" fill="rgba(200, 200, 200, 0.6)" />
                          <circle cx="95" cy="28" r="7" fill="rgba(220, 220, 220, 0.7)" />
                          <circle cx="110" cy="26" r="5" fill="rgba(190, 190, 190, 0.6)" />
                          <circle cx="125" cy="32" r="6" fill="rgba(215, 215, 215, 0.7)" />
                          {/* Age spots */}
                          <circle cx="70" cy="85" r="2" fill="rgba(139, 119, 101, 0.5)" />
                          <circle cx="125" cy="90" r="1.5" fill="rgba(139, 119, 101, 0.4)" />
                          <circle cx="105" cy="75" r="1.5" fill="rgba(139, 119, 101, 0.45)" />
                          <circle cx="85" cy="95" r="1" fill="rgba(139, 119, 101, 0.35)" />
                        </svg>
                        
                        {/* Age badge */}
                        <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          +20년
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                      <span className="text-purple-400 text-4xl">👤</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Description */}
            {result.futureDescription && (
              <div className="bg-white/50 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-700 leading-relaxed">{result.futureDescription}</p>
              </div>
            )}
            
            {/* Aging indicators */}
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
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
