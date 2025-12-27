
import React, { useState } from 'react';
import { DREAM_MOODS } from '../constants';
import { Dream } from '../types';

interface DreamEntryProps {
  onSave: (dream: Partial<Dream>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const DreamEntry: React.FC<DreamEntryProps> = ({ onSave, onCancel, isLoading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(DREAM_MOODS[0].id);
  const [vividness, setVividness] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave({ title, content, mood, vividness });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 glass rounded-3xl animate-pulse">
        <div className="w-20 h-20 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-6"></div>
        <h3 className="text-xl font-medium text-white/80">Gemini is architecting your subconscious...</h3>
        <p className="text-white/40 mt-2 text-sm">Decoding symbols, themes, and ethereal patterns</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8 border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <i className="fas fa-feather-pointed text-purple-400"></i>
        Record a Dream
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Dream Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A flight through crystal towers..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-white/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">What happened?</label>
          <textarea 
            required
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your dream in as much detail as possible..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-white/20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-3">Overall Vibe</label>
            <div className="grid grid-cols-3 gap-2">
              {DREAM_MOODS.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border transition-all ${mood === m.id ? 'bg-purple-500/20 border-purple-500 text-white' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`}
                >
                  <span className="text-xl mb-1">{m.icon}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-3">Vividness ({vividness}/10)</label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={vividness}
              onChange={(e) => setVividness(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-white/30 mt-2 uppercase">
              <span>Faint</span>
              <span>Cinematic</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit"
            className="flex-1 dream-gradient text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            Analyze Memory
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="px-6 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DreamEntry;
