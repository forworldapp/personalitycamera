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
            <div className="flex justify-center space-x-4 mb-4">
              {/* Current Image */}
              <div className="text-center">
                <div className="relative w-24 h-24">
                  {capturedImage ? (
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-blue-200">
                      <img 
                        src={capturedImage} 
                        alt="Current" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                        현재
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full flex items-center justify-center">
                      <span className="text-blue-400 text-xl">👤</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">{result.predictedAge}세</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <div className="text-2xl text-purple-400">→</div>
              </div>

              {/* Future Image */}
              <div className="text-center">
                <div className="relative w-24 h-24">
                  {capturedImage ? (
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-purple-200">
                      <img 
                        src={capturedImage} 
                        alt="Future prediction" 
                        className="w-full h-full object-cover"
                      />
                      {/* Subtle aging overlay effects */}
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Gentle aging filter */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-50/20 mix-blend-soft-light"></div>
                        
                        {/* Realistic aging overlay */}
                        <svg className="w-full h-full" viewBox="0 0 128 128">
                          {/* Subtle wrinkle lines around eyes */}
                          <path 
                            d="M30 42 Q32 44 34 42 M94 42 Q96 44 98 42" 
                            stroke="rgba(139, 119, 101, 0.3)" 
                            strokeWidth="0.3" 
                            fill="none"
                          />
                          {/* Light forehead lines */}
                          <path 
                            d="M40 30 Q64 28 88 30" 
                            stroke="rgba(139, 119, 101, 0.25)" 
                            strokeWidth="0.3" 
                            fill="none"
                          />
                          {/* Slight smile lines */}
                          <path 
                            d="M42 75 Q48 78 52 75 M76 75 Q82 78 86 75" 
                            stroke="rgba(139, 119, 101, 0.2)" 
                            strokeWidth="0.3" 
                            fill="none"
                          />
                          {/* Gray hair spots (more subtle) */}
                          <circle cx="45" cy="20" r="1.5" fill="rgba(200, 200, 200, 0.4)" />
                          <circle cx="60" cy="18" r="2" fill="rgba(210, 210, 210, 0.4)" />
                          <circle cx="75" cy="21" r="1.5" fill="rgba(190, 190, 190, 0.3)" />
                          {/* Very subtle age spots */}
                          <circle cx="40" cy="60" r="0.8" fill="rgba(160, 140, 120, 0.3)" />
                          <circle cx="85" cy="65" r="0.6" fill="rgba(160, 140, 120, 0.25)" />
                          {/* Maturity overlay instead of heavy aging */}
                          <rect x="0" y="0" width="128" height="128" fill="url(#maturity-filter)" opacity="0.08"/>
                          <defs>
                            <pattern id="maturity-filter" patternUnits="userSpaceOnUse" width="8" height="8">
                              <circle cx="4" cy="4" r="0.3" fill="rgba(139, 119, 101, 0.2)"/>
                            </pattern>
                          </defs>
                        </svg>
                      </div>
                      {/* Age indicator badge */}
                      <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                        +20년
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center">
                      <span className="text-purple-400 text-xl">👤</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">{result.futureAge}세</p>
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
