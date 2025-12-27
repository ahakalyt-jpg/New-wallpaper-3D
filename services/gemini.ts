
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Dream, DreamAnalysis } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeDream(content: string): Promise<DreamAnalysis> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following dream text. Provide an interpretation, identify symbols and their meanings, extract themes, and assess the emotional tone. Return the result in a JSON structure.
      
      Dream text: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interpretation: { type: Type.STRING },
            symbols: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  meaning: { type: Type.STRING }
                },
                required: ["name", "meaning"]
              }
            },
            themes: { type: Type.ARRAY, items: { type: Type.STRING } },
            emotionalTone: { type: Type.STRING },
            lucidityScore: { type: Type.NUMBER }
          },
          required: ["interpretation", "symbols", "themes", "emotionalTone", "lucidityScore"]
        }
      }
    });

    return JSON.parse(response.text);
  }

  async generateDreamImage(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: `A surreal, ethereal, and artistic dreamscape representation of: ${prompt}. Cinematic lighting, dream-like atmosphere, high quality digital art.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  }

  async generateDreamNarration(text: string): Promise<Uint8Array> {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this dream analysis in a calm, soothing, meditative voice: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio generated");
    
    return this.decodeBase64(base64Audio);
  }

  private decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}

export const gemini = new GeminiService();
