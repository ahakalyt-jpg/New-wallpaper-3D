
export interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  vividness: number; // 1-10
  analysis?: DreamAnalysis;
  imageUrl?: string;
  audioUrl?: string;
}

export interface DreamAnalysis {
  interpretation: string;
  symbols: { name: string; meaning: string }[];
  themes: string[];
  emotionalTone: string;
  lucidityScore: number;
}

export enum View {
  JOURNAL = 'journal',
  INSIGHTS = 'insights',
  SETTINGS = 'settings'
}

export interface AnalysisResponse {
  analysis: DreamAnalysis;
}
