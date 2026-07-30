import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // In-memory cache for flavor text: eventId -> string
  const flavorCache: Record<string, string> = {};

  app.post("/api/flavor", async (req, res) => {
    try {
      const { playerId = 'player_default', eventId, eventTitle, eventDescription } = req.body;
      
      if (!eventId) {
        return res.status(400).json({ error: "Missing eventId" });
      }

      const cacheKey = `${playerId}_${eventId}`;
      if (flavorCache[cacheKey]) {
        return res.json({ text: flavorCache[cacheKey] });
      }

      // We use 3.6-flash for simple text generation
      const prompt = `Você está gerando "flavor text" (texto de ambientação) para um jogo cyberpunk sombrio chamado "Mainframe Prime".
Gere uma variação curta (2 a 3 frases no máximo) para complementar a narrativa do seguinte evento:

Título: ${eventTitle || 'Evento Desconhecido'}
Descrição original: ${eventDescription || 'Sem descrição'}

O texto deve ser imersivo, direto e não pode alterar a mecânica do jogo ou introduzir novos personagens. Foco no clima sombrio, tecnologia decadente ou tensão. Use português do Brasil.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "Você é um narrador cyberpunk. Responda apenas com o flavor text, sem explicações ou aspas.",
          temperature: 0.7,
        },
      });

      const text = response.text?.trim() || "";
      if (text) {
        flavorCache[cacheKey] = text;
      }
      
      res.json({ text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate flavor text" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
