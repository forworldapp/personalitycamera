import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import CameraSection from "@/components/camera-section";
import HistorySection from "@/components/history-section";

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">🤖</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Age AI</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">👤</span>
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.firstName || user?.email?.split('@')[0] || 'User'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-primary transition-colors"
              title="로그아웃"
            >
              <span className="text-sm">🚪</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <CameraSection />
        <HistorySection />

        {/* Info Section */}
        <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-white text-xl">ℹ️</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">AI 분석 정보</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Google Gemini AI를 사용하여 얼굴 특징을 분석하고 나이를 예측합니다. 
              결과는 참고용이며 실제와 다를 수 있습니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <div className="text-primary font-semibold text-lg">AI 기반</div>
              <div className="text-xs text-gray-500">분석 방식</div>
            </div>
            <div className="text-center">
              <div className="text-primary font-semibold text-lg">실시간</div>
              <div className="text-xs text-gray-500">처리 속도</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
