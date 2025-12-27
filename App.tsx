
import React, { useState, useEffect, useCallback } from 'react';
import { BackgroundSVG, DREAM_MOODS } from './constants';
import { View, Dream } from './types';
import DreamList from './components/DreamList';
import DreamEntry from './components/DreamEntry';
import Insights from './components/Insights';
import { gemini } from './services/gemini';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.JOURNAL);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('somnia_dreams');
    if (saved) {
      try {
        setDreams(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse dreams", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('somnia_dreams', JSON.stringify(dreams));
  }, [dreams]);

  const handleAddDream = async (dreamData: Partial<Dream>) => {
    setLoading(true);
    try {
      const id = Date.now().toString();
      const newDream: Dream = {
        id,
        title: dreamData.title || 'Untitled Dream',
        content: dreamData.content || '',
        date: new Date().toISOString(),
        mood: dreamData.mood || 'mysterious',
        vividness: dreamData.vividness || 5,
      };

      // Get AI Analysis
      const analysis = await gemini.analyzeDream(newDream.content);
      newDream.analysis = analysis;

      // Generate AI Visual
      try {
        const imageUrl = await gemini.generateDreamImage(newDream.content);
        newDream.imageUrl = imageUrl;
      } catch (err) {
        console.warn("Image generation failed", err);
      }

      setDreams(prev => [newDream, ...prev]);
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to add dream", error);
      alert("Something went wrong analyzing your dream. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDream = (id: string) => {
    if (window.confirm("Are you sure you want to delete this dream memory?")) {
      setDreams(prev => prev.filter(d => d.id !== id));
    }
  };

  return (
    <div className="relative min-h-screen pb-24">
      <BackgroundSVG />
      
      {/* Header */}
      <header className="sticky top-0 z-40 w-full px-6 py-4 glass border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full dream-gradient flex items-center justify-center shadow-lg shadow-purple-500/20">
            <i className="fas fa-moon text-white"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-glow">SOMNIA</h1>
        </div>
        
        <div className="flex gap-2">
           <button 
            onClick={() => setView(View.JOURNAL)}
            className={`p-2 px-4 rounded-full transition-all ${view === View.JOURNAL ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
          >
            Journal
          </button>
          <button 
            onClick={() => setView(View.INSIGHTS)}
            className={`p-2 px-4 rounded-full transition-all ${view === View.INSIGHTS ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
          >
            Insights
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 mt-4">
        {view === View.JOURNAL && (
          <>
            {isAdding ? (
              <DreamEntry 
                onSave={handleAddDream} 
                onCancel={() => setIsAdding(false)} 
                isLoading={loading}
              />
            ) : (
              <DreamList 
                dreams={dreams} 
                onDelete={handleDeleteDream}
                onAddRequest={() => setIsAdding(true)}
              />
            )}
          </>
        )}
        
        {view === View.INSIGHTS && (
          <Insights dreams={dreams} />
        )}
      </main>

      {/* Navigation Bottom (for Mobile UX) */}
      {!isAdding && view === View.JOURNAL && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <button 
            onClick={() => setIsAdding(true)}
            className="w-16 h-16 rounded-full dream-gradient text-white shadow-2xl shadow-purple-500/50 hover:scale-110 transition-transform flex items-center justify-center text-2xl"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
