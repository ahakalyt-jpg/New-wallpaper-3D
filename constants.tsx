
import React from 'react';

export const DREAM_MOODS = [
  { id: 'mysterious', icon: '✨', label: 'Mysterious' },
  { id: 'scary', icon: '🌑', label: 'Scary' },
  { id: 'peaceful', icon: '🍃', label: 'Peaceful' },
  { id: 'adventurous', icon: '🚀', label: 'Adventurous' },
  { id: 'emotional', icon: '💧', label: 'Emotional' },
  { id: 'surreal', icon: '🌀', label: 'Surreal' },
];

export const BackgroundSVG = () => (
  <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
    <svg viewBox="0 0 1080 2400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
      <defs>
        <radialGradient id="grad1" cx="30%" cy="20%">
          <stop offset="0%" style={{ stopColor: '#FF6B9D', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#C239B3', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4A148C', stopOpacity: 1 }} />
        </radialGradient>
        <radialGradient id="grad2" cx="70%" cy="80%">
          <stop offset="0%" style={{ stopColor: '#FFA726', stopOpacity: 0.8 }} />
          <stop offset="50%" style={{ stopColor: '#FF6B9D', stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: '#1A237E', stopOpacity: 1 }} />
        </radialGradient>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#667EEA', stopOpacity: 0.5 }} />
          <stop offset="100%" style={{ stopColor: '#764BA2', stopOpacity: 0.5 }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="20" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <rect width="1080" height="2400" fill="url(#grad1)"/>
      <rect width="1080" height="2400" fill="url(#grad2)"/>
      
      <circle cx="200" cy="400" r="180" fill="#FF6B9D" opacity="0.3" filter="url(#glow)"/>
      <circle cx="850" cy="700" r="220" fill="#FFA726" opacity="0.25" filter="url(#glow)"/>
      <circle cx="300" cy="1400" r="200" fill="#667EEA" opacity="0.3" filter="url(#glow)"/>
      <circle cx="780" cy="1900" r="190" fill="#FF6B9D" opacity="0.25" filter="url(#glow)"/>
      <circle cx="540" cy="1100" r="150" fill="#C239B3" opacity="0.2" filter="url(#glow)"/>
      
      <circle cx="100" cy="200" r="3" fill="white" opacity="0.8"/>
      <circle cx="950" cy="500" r="2" fill="white" opacity="0.7"/>
      <circle cx="200" cy="1800" r="2.5" fill="white" opacity="0.9"/>
      <circle cx="850" cy="2100" r="2" fill="white" opacity="0.6"/>
      <circle cx="500" cy="900" r="3" fill="white" opacity="0.8"/>
      <circle cx="750" cy="1500" r="2" fill="white" opacity="0.7"/>
      
      <rect width="1080" height="2400" fill="url(#grad3)"/>
    </svg>
  </div>
);
