import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface AgePrediction {
  id: string;
  predictedAge: number;
  futureAge: number;
  confidence: string;
  createdAt: string;
  imageUrl: string;
}

export default function HistorySection() {
  const { data: predictions, isLoading } = useQuery<AgePrediction[]>({
    queryKey: ['/api/predictions'],
    refetchInterval: false,
  });

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">최근 분석 기록</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!predictions || predictions.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">최근 분석 기록</h3>
        </div>
        <Card className="bg-gray-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">📷</span>
            </div>
            <p className="text-gray-600 mb-4">아직 분석한 사진이 없습니다</p>
            <p className="text-sm text-gray-500">첫 번째 사진을 촬영해보세요!</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">최근 분석 기록</h3>
        {predictions.length > 3 && (
          <Button variant="ghost" className="text-primary text-sm font-medium hover:text-primary/80">
            전체보기
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {predictions.slice(0, 5).map((prediction) => (
          <Card key={prediction.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                {prediction.imageUrl ? (
                  <img 
                    src={prediction.imageUrl} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">👤</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{prediction.predictedAge}세</span>
                  <span className="text-gray-400 text-xs">→</span>
                  <span className="text-primary font-medium">{prediction.futureAge}세</span>
                  <div className="flex-1"></div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    prediction.confidence === 'high' ? 'bg-green-100 text-green-600' :
                    prediction.confidence === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {prediction.confidence === 'high' ? '높음' :
                     prediction.confidence === 'medium' ? '보통' : '낮음'}
                  </div>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {format(new Date(prediction.createdAt), 'MM월 dd일 HH:mm', { locale: ko })}
                </p>
              </div>
              
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-2">
                <span className="text-sm">〉</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
