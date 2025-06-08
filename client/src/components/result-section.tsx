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
              <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mx-auto flex items-center justify-center">
                <span className="text-purple-400 text-2xl">👤</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-purple-600">{result.futureAge}세</span>
                <p className="text-sm text-gray-600">예상 모습입니다</p>
              </div>
              {result.futureDescription && (
                <p className="text-sm text-gray-600 mt-2">{result.futureDescription}</p>
              )}
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
