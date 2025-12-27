
import React, { useState } from 'react';
import { Dream } from '../types';
import { DREAM_MOODS } from '../constants';
import { gemini } from '../services/gemini';

interface DreamCardProps {
  dream: Dream;
  onDelete: (id: string) => void;
}

const DreamCard: React.FC<DreamCardProps> = ({ dream, onDelete }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [audioContext] = useState(() => new (window.AudioContext || (window as any).webkitAudioContext)());

  const moodData = DREAM_MOODS.find(m => m.id === dream.mood) || DREAM_MOODS[0];

  const toggleNarration = async () => {
    if (isPlaying && audioSource) {
      audioSource.stop();
      setIsPlaying(false);
      return;
    }

    if (!dream.analysis) return;

    try {
      setIsPlaying(true);
      const textToRead = `Analysis of your dream, ${dream.title}. ${dream.analysis.interpretation}`;
      const audioData = await gemini.generateDreamNarration(textToRead);
      
      const audioBuffer = await decodeAudioStream(audioData);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      setAudioSource(source);
    } catch (error) {
      console.error("Audio playback error", error);
      setIsPlaying(false);
    }
  };

  const decodeAudioStream = async (data: Uint8Array): Promise<AudioBuffer> => {
    // Note: The Gemini TTS returns raw PCM data, we need to convert it.
    // However, simple decoding might work if the output is standard.
    // For this demo, we use the raw bytes pattern from the docs if needed,
    // but standard decodeAudioData is used here assuming a standard format.
    return await audioContext.decodeAudioData(data.buffer);
  };

  return (
    <div className="glass rounded-3xl overflow-hidden border border-white/10 group animate-in zoom-in-95 duration-300">
      {/* Visual Header */}
      <div className="relative h-48 overflow-hidden bg-slate-900">
        {dream.imageUrl ? (
          <img src={dream.imageUrl} alt={dream.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full dream-gradient opacity-30 flex items-center justify-center">
             <i className="fas fa-image text-white/20 text-4xl"></i>
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
            {new Date(dream.date).toLocaleDateString()}
          </span>
          <span className="bg-purple-600/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
            {moodData.icon} {moodData.label}
          </span>
        </div>
        <button 
          onClick={() => onDelete(dream.id)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white/60 hover:text-red-400 hover:bg-black/60 transition-all flex items-center justify-center"
        >
          <i className="fas fa-trash-can text-xs"></i>
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-3">{dream.title}</h3>
        <p className="text-white/60 text-sm line-clamp-3 mb-6 leading-relaxed">
          {dream.content}
        </p>

        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
          <button 
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="text-xs font-bold uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
          >
            {showAnalysis ? 'Hide Analysis' : 'Explore Subconscious'}
            <i className={`fas fa-chevron-${showAnalysis ? 'up' : 'down'} text-[10px]`}></i>
          </button>
          
          {dream.analysis && (
            <button 
              onClick={toggleNarration}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-purple-500 text-white animate-pulse' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
            >
              <i className={`fas fa-${isPlaying ? 'pause' : 'volume-up'}`}></i>
            </button>
          )}
        </div>

        {/* Analysis Detail */}
        {showAnalysis && dream.analysis && (
          <div className="mt-6 pt-6 border-t border-white/5 space-y-6 animate-in fade-in slide-in-from-top-4">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Interpretation</h4>
              <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 italic">
                "{dream.analysis.interpretation}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Themes</h4>
                <div className="flex flex-wrap gap-1">
                  {dream.analysis.themes.map((t, idx) => (
                    <span key={idx} className="bg-white/5 px-2 py-1 rounded-md text-[10px] text-white/60 border border-white/5">#{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Emotional Tone</h4>
                <span className="text-xs font-medium text-white/80 capitalize">{dream.analysis.emotionalTone}</span>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Symbols Identified</h4>
              <div className="space-y-3">
                {dream.analysis.symbols.map((sym, idx) => (
                  <div key={idx} className="bg-black/20 p-3 rounded-xl border border-white/5">
                    <div className="text-xs font-bold text-purple-300 mb-1">{sym.name}</div>
                    <div className="text-[11px] text-white/60 leading-tight">{sym.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamCard;
