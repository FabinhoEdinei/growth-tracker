'use client';

import { useVisitCounter } from '@/app/hooks/useVisitCounter';
import { useState, useEffect } from 'react';

export const VisitCounter = () => {
  const { visitCount, isNewVisitor } = useVisitCounter();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isNewVisitor && visitCount > 0) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isNewVisitor, visitCount]);

  return (
    <div className={`visit-counter ${showAnimation ? 'animate' : ''}`}>
      <div className="counter-icon">👁️</div>
      <div className="counter-content">
        <span className="counter-label">VISITAS HOJE</span>
        <span className="counter-value">{visitCount}</span>
      </div>

      <style jsx>{`
        .visit-counter {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(255, 170, 0, 0.1);
          border: 1px solid rgba(255, 170, 0, 0.3);
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          transition: all 0.3s ease;
          cursor: help;
        }

        .visit-counter:hover {
          background: rgba(255, 170, 0, 0.2);
          border-color: rgba(255, 170, 0, 0.5);
          box-shadow: 0 0 15px rgba(255, 170, 0, 0.3);
          transform: scale(1.05);
        }

        .visit-counter.animate {
          animation: counterPulse 0.5s ease-in-out;
        }

        @keyframes counterPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(255, 170, 0, 0.3);
          }
          50% {
            transform: scale(1.15);
            box-shadow: 0 0 25px rgba(255, 170, 0, 0.6);
          }
        }

        .counter-icon {
          font-size: 16px;
          animation: blink 3s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0.3; }
        }

        .counter-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .counter-label {
          font-size: 7px;
          color: rgba(255, 170, 0, 0.6);
          letter-spacing: 1.5px;
          line-height: 1;
        }

        .counter-value {
          font-size: 14px;
          color: #ffaa00;
          font-weight: bold;
          letter-spacing: 1px;
          text-shadow: 0 0 8px rgba(255, 170, 0, 0.5);
        }

        @media (max-width: 768px) {
          .visit-counter {
            padding: 5px 10px;
            gap: 6px;
          }

          .counter-icon {
            font-size: 14px;
          }

          .counter-label {
            font-size: 6px;
          }

          .counter-value {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};