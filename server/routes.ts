import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPersonalityAnalysisSchema } from "@shared/schema";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ""
);

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {

    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Personality analysis routes
  app.post('/api/analyze-personality', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      console.log('POST /api/analyze-personality - Request received');
      console.log('Headers:', req.headers);
      console.log('Content-Type:', req.get('Content-Type'));
      console.log('File:', req.file);
      console.log('Body keys:', Object.keys(req.body));
      
      if (!req.file) {
        console.log('No file found in request');
        return res.status(400).json({ message: "No image file provided" });
      }

      // Convert image to base64
      const imageBase64 = req.file.buffer.toString('base64');
      const imageMimeType = req.file.mimetype;

      // Call Gemini Vision API for personality analysis
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Analyze this person's facial features, expressions, and overall appearance to predict their personality type and traits. Consider facial symmetry, eye contact, smile patterns, jawline, and overall demeanor.

      Respond in JSON format with the following structure:
      {
        "mbtiType": "ENFP" (one of the 16 MBTI types),
        "confidence": "high|medium|low",
        "traits": {
          "openness": 8 (scale 1-10),
          "conscientiousness": 7 (scale 1-10), 
          "extraversion": 6 (scale 1-10),
          "agreeableness": 9 (scale 1-10),
          "neuroticism": 3 (scale 1-10)
        },
        "analysis": {
          "ko": "한국어로 성격 분석 결과 (200자 내외)",
          "en": "English personality analysis result (around 200 characters)"
        },
        "strengths": {
          "ko": "한국어로 강점 설명 (150자 내외)",
          "en": "English strengths description (around 150 characters)"
        },
        "weaknesses": {
          "ko": "한국어로 약점 설명 (150자 내외)", 
          "en": "English weaknesses description (around 150 characters)"
        },
        "recommendations": {
          "ko": "한국어로 개선 및 발전 방향 제안 (200자 내외)",
          "en": "English improvement and development suggestions (around 200 characters)"
        }
      }`;

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType,
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      let analysisData;
      try {
        // Try to parse JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        // Fallback if JSON parsing fails
        console.error("Failed to parse Gemini response as JSON:", parseError);
        analysisData = {
          mbtiType: "ENFP",
          confidence: "medium",
          traits: {
            openness: 7,
            conscientiousness: 6,
            extraversion: 7,
            agreeableness: 8,
            neuroticism: 4
          },
          analysis: {
            ko: "분석 중 오류가 발생했습니다. 다시 시도해주세요.",
            en: "Analysis error occurred. Please try again."
          },
          strengths: {
            ko: "긍정적인 에너지와 사교성",
            en: "Positive energy and sociability"
          },
          weaknesses: {
            ko: "때로는 집중력 부족",
            en: "Sometimes lack of focus"
          },
          recommendations: {
            ko: "체계적인 계획 수립을 통한 목표 달성",
            en: "Achieve goals through systematic planning"
          }
        };
      }

      // Store the analysis in database
      const analysis = await storage.createPersonalityAnalysis({
        userId,
        imageUrl: `data:${imageMimeType};base64,${imageBase64}`, // Store as data URL for now
        mbtiType: analysisData.mbtiType,
        confidence: analysisData.confidence,
        traits: analysisData.traits,
        analysis: analysisData.analysis,
        strengths: analysisData.strengths,
        weaknesses: analysisData.weaknesses,
        recommendations: analysisData.recommendations,
        geminiResponse: analysisData,
      });

      res.json({
        id: analysis.id,
        mbtiType: analysis.mbtiType,
        confidence: analysis.confidence,
        traits: analysis.traits,
        analysis: analysis.analysis,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        recommendations: analysis.recommendations,
        createdAt: analysis.createdAt,
      });

    } catch (error) {
      console.error("Error analyzing personality:", error);
      res.status(500).json({ 
        message: "Failed to analyze personality", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get user's analysis history
  app.get('/api/analyses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const analyses = await storage.getUserPersonalityAnalyses(userId, limit);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching analyses:", error);
      res.status(500).json({ message: "Failed to fetch analyses" });
    }
  });

  // Get specific analysis
  app.get('/api/analyses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const prediction = await storage.getAgePrediction(req.params.id);
      
      if (!prediction) {
        return res.status(404).json({ message: "Prediction not found" });
      }

      // Check if the prediction belongs to the current user
      if (prediction.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      res.status(500).json({ message: "Failed to fetch prediction" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
