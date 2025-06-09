import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">🤖</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Age AI</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-r from-primary to-primary/80 rounded-full mx-auto flex items-center justify-center shadow-2xl">
            <span className="text-white text-4xl">🔮</span>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">얼굴 나이 예측</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              AI가 당신의 나이를 분석하고<br />
              20년 후 모습을 예측해드려요
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">실시간 카메라</h3>
                  <p className="text-sm text-gray-600">웹캠으로 간편하게 촬영</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🧠</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI 분석</h3>
                  <p className="text-sm text-gray-600">Google Gemini로 정확한 예측</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">히스토리 저장</h3>
                  <p className="text-sm text-gray-600">분석 기록을 안전하게 보관</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="space-y-4 pt-4">
          <Button 
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white py-4 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Google로 시작하기
          </Button>
          
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            로그인하면 분석 기록이 안전하게 저장되며,<br />
            언제든지 다시 확인할 수 있습니다.
          </p>
        </div>
      </main>
    </div>
  );
}
