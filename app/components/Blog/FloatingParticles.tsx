'use client';

import { useEffect, useRef } from 'react';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ 
  count = 20,
  color = '#00ff88'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = ''; // Limpar

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (10 + Math.random() * 10) + 's';
      container.appendChild(particle);
    }
  }, [count]);

  return (
    <>
      <div ref={containerRef} className="particles-container" />
      
      <style jsx>{`
        .particles-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        :global(.floating-particle) {
          position: absolute;
          width: 4px;
          height: 4px;
          background: ${color};
          border-radius: 50%;
          opacity: 0.6;
          animation: float 15s infinite;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(100vh) rotate(0deg); 
            opacity: 0; 
          }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { 
            transform: translateY(-100vh) rotate(720deg); 
            opacity: 0; 
          }
        }
      `}</style>
    </>
  );
};