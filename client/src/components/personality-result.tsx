import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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

interface PersonalityResultProps {
  result: PersonalityResult;
  capturedImage: string | null;
  onRetake: () => void;
  language: 'ko' | 'en';
  onLanguageChange: (lang: 'ko' | 'en') => void;
}

export default function PersonalityResult({ 
  result, 
  capturedImage, 
  onRetake, 
  language, 
  onLanguageChange 
}: PersonalityResultProps) {
  const { toast } = useToast();

  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === 'ko' ? '내 성격 분석 결과' : 'My Personality Analysis',
          text: `${language === 'ko' ? 'MBTI 유형:' : 'MBTI Type:'} ${result.mbtiType}\n${result.analysis[language]}`,
        });
      } catch (error) {
        console.error('Sharing failed:', error);
      }
    } else {
      navigator.clipboard.writeText(
        `${language === 'ko' ? 'MBTI 유형:' : 'MBTI Type:'} ${result.mbtiType}\n${result.analysis[language]}`
      );
      toast({
        title: language === 'ko' ? "복사 완료" : "Copied",
        description: language === 'ko' ? "결과가 클립보드에 복사되었습니다." : "Result copied to clipboard.",
      });
    }
  };

  const getMBTIDescription = (type: string) => {
    const descriptions = {
      ko: {
        'INTJ': '전략가', 'INTP': '논리학자', 'ENTJ': '통솔자', 'ENTP': '변론가',
        'INFJ': '옹호자', 'INFP': '중재자', 'ENFJ': '선도자', 'ENFP': '활동가',
        'ISTJ': '현실주의자', 'ISFJ': '수호자', 'ESTJ': '관리자', 'ESFJ': '외교관',
        'ISTP': '만능재주꾼', 'ISFP': '모험가', 'ESTP': '사업가', 'ESFP': '연예인'
      },
      en: {
        'INTJ': 'Architect', 'INTP': 'Thinker', 'ENTJ': 'Commander', 'ENTP': 'Debater',
        'INFJ': 'Advocate', 'INFP': 'Mediator', 'ENFJ': 'Protagonist', 'ENFP': 'Campaigner',
        'ISTJ': 'Logistician', 'ISFJ': 'Protector', 'ESTJ': 'Executive', 'ESFJ': 'Consul',
        'ISTP': 'Virtuoso', 'ISFP': 'Adventurer', 'ESTP': 'Entrepreneur', 'ESFP': 'Entertainer'
      }
    };
    return descriptions[language][type as keyof typeof descriptions[typeof language]] || type;
  };

  const getTraitName = (trait: string) => {
    const names = {
      ko: {
        openness: '개방성',
        conscientiousness: '성실성',
        extraversion: '외향성',
        agreeableness: '친화성',
        neuroticism: '신경성'
      },
      en: {
        openness: 'Openness',
        conscientiousness: 'Conscientiousness',
        extraversion: 'Extraversion',
        agreeableness: 'Agreeableness',
        neuroticism: 'Neuroticism'
      }
    };
    return names[language][trait as keyof typeof names[typeof language]] || trait;
  };

  return (
    <div className="space-y-6">
      {/* Language Toggle */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
          <Button
            variant={language === 'ko' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onLanguageChange('ko')}
            className="rounded-full"
          >
            한국어
          </Button>
          <Button
            variant={language === 'en' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onLanguageChange('en')}
            className="rounded-full"
          >
            English
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {language === 'ko' ? '성격 분석 결과' : 'Personality Analysis Result'}
            </h2>
            <div className="text-sm text-gray-600">
              {language === 'ko' ? '신뢰도:' : 'Confidence:'} {result.confidence}
            </div>
          </div>

          {/* Photo and MBTI Type */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            {capturedImage && (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg">
                <img 
                  src={capturedImage} 
                  alt="Analysis subject" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{result.mbtiType}</div>
              <div className="text-xl text-gray-700 font-medium">
                {getMBTIDescription(result.mbtiType)}
              </div>
            </div>
          </div>

          {/* Big Five Traits */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {language === 'ko' ? '성격 특성' : 'Personality Traits'}
            </h3>
            <div className="space-y-3">
              {Object.entries(result.traits).map(([trait, score]) => (
                <div key={trait} className="flex items-center space-x-3">
                  <div className="w-20 text-sm text-gray-600 font-medium">
                    {getTraitName(trait)}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
                      style={{ width: `${score * 10}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-sm font-bold text-purple-600">
                    {score}/10
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis */}
          <div className="space-y-4">
            <div className="bg-white/70 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                {language === 'ko' ? '성격 분석' : 'Analysis'}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {result.analysis[language]}
              </p>
            </div>

            <div className="bg-white/70 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                {language === 'ko' ? '강점' : 'Strengths'}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {result.strengths[language]}
              </p>
            </div>

            <div className="bg-white/70 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                {language === 'ko' ? '개선점' : 'Areas for Improvement'}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {result.weaknesses[language]}
              </p>
            </div>

            <div className="bg-white/70 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                {language === 'ko' ? '추천사항' : 'Recommendations'}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {result.recommendations[language]}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-3 mt-6">
            <Button
              onClick={onRetake}
              variant="outline"
              className="flex-1"
            >
              {language === 'ko' ? '다시 분석' : 'Analyze Again'}
            </Button>
            <Button
              onClick={shareResult}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
            >
              {language === 'ko' ? '결과 공유' : 'Share Result'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}