
import React from 'react';
import { Dream } from '../types';
import DreamCard from './DreamCard';

interface DreamListProps {
  dreams: Dream[];
  onDelete: (id: string) => void;
  onAddRequest: () => void;
}

const DreamList: React.FC<DreamListProps> = ({ dreams, onDelete, onAddRequest }) => {
  if (dreams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 rounded-full glass flex items-center justify-center mb-6 text-white/10 text-4xl">
          <i className="fas fa-moon"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">Your astral journal is empty</h2>
        <p className="text-white/40 max-w-xs mb-8">Begin your journey by recording your first subconscious memory.</p>
        <button 
          onClick={onAddRequest}
          className="px-8 py-3 dream-gradient rounded-full font-bold shadow-xl shadow-purple-500/20 hover:scale-105 transition-all"
        >
          Wake Up & Write
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
      {dreams.map(dream => (
        <DreamCard key={dream.id} dream={dream} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default DreamList;
