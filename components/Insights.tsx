
import React, { useMemo } from 'react';
import { Dream } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

interface InsightsProps {
  dreams: Dream[];
}

const COLORS = ['#FF6B9D', '#C239B3', '#4A148C', '#FFA726', '#667EEA', '#764BA2'];

const Insights: React.FC<InsightsProps> = ({ dreams }) => {
  const moodStats = useMemo(() => {
    const counts: Record<string, number> = {};
    dreams.forEach(d => {
      counts[d.mood] = (counts[d.mood] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [dreams]);

  const vividnessStats = useMemo(() => {
    return dreams.slice(0, 7).reverse().map(d => ({
      name: new Date(d.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      vividness: d.vividness
    }));
  }, [dreams]);

  if (dreams.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 glass rounded-3xl text-center">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-xl font-bold mb-2">Insufficient Data</h3>
        <p className="text-white/40 max-w-xs">Record at least 2 dreams to generate pattern insights and subconscious analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="glass p-6 rounded-3xl border border-white/10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
            <i className="fas fa-chart-pie text-purple-400"></i>
            Emotional Landscapes
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodStats}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {moodStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {moodStats.map((m, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-[10px] uppercase text-white/60">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vividness History */}
        <div className="glass p-6 rounded-3xl border border-white/10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
            <i className="fas fa-wave-square text-pink-400"></i>
            Recall Fidelity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vividnessStats}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="vividness" stroke="#C239B3" strokeWidth={3} dot={{ fill: '#FF6B9D', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Symbols */}
      <div className="glass p-6 rounded-3xl border border-white/10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Global Symbol Recurring</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(dreams.flatMap(d => d.analysis?.themes || []))).slice(0, 10).map((theme, i) => (
            <span key={i} className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs text-white/80 hover:bg-white/10 transition-colors cursor-default">
              #{theme}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Insights;
