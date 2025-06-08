import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertAgePredictionSchema } from "@shared/schema";
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

  // Age prediction routes
  app.post('/api/predict-age', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      console.log('POST /api/predict-age - Request received');
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

      // Call Gemini Vision API for age prediction
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Please analyze this face image and predict the person's age. Also, describe how this person might look in 20 years. 
      Respond in JSON format with the following structure:
      {
        "predictedAge": number,
        "futureAge": number (current age + 20),
        "confidence": "high|medium|low",
        "analysis": "Brief description of facial features and aging prediction",
        "futureDescription": "Detailed description of how the person might look in 20 years including changes in skin, hair, facial structure"
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
          predictedAge: 25,
          futureAge: 45,
          confidence: "medium",
          analysis: "Unable to parse detailed analysis",
          futureDescription: "General aging predictions apply"
        };
      }

      // Store the prediction in database
      const prediction = await storage.createAgePrediction({
        userId,
        imageUrl: `data:${imageMimeType};base64,${imageBase64}`, // Store as data URL for now
        predictedAge: analysisData.predictedAge,
        futureAge: analysisData.futureAge,
        confidence: analysisData.confidence,
        analysis: analysisData.analysis,
        futureDescription: analysisData.futureDescription,
        geminiResponse: analysisData,
      });

      res.json({
        id: prediction.id,
        predictedAge: prediction.predictedAge,
        futureAge: prediction.futureAge,
        confidence: prediction.confidence,
        analysis: analysisData.analysis,
        futureDescription: analysisData.futureDescription,
        createdAt: prediction.createdAt,
      });

    } catch (error) {
      console.error("Error predicting age:", error);
      res.status(500).json({ 
        message: "Failed to analyze image", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get user's prediction history
  app.get('/api/predictions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const predictions = await storage.getUserAgePredictions(userId, limit);
      res.json(predictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });

  // Get specific prediction
  app.get('/api/predictions/:id', isAuthenticated, async (req: any, res) => {
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
