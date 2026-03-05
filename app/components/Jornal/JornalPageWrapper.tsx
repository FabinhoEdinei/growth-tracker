'use client';

import { ReactNode } from 'react';

interface JornalPageWrapperProps {
  children: ReactNode;
}

export const JornalPageWrapper: React.FC<JornalPageWrapperProps> = ({ children }) => {
  return (
    <div className="jornal-page">
      {children}

      <style jsx>{`
        .jornal-page {
          min-height: 100vh;
          background: linear-gradient(
            180deg,
            #faf8f0 0%,
            #f5f0e8 50%,
            #faf8f0 100%
          );
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 69, 19, 0.01) 2px,
              rgba(139, 69, 19, 0.01) 4px
            );
        }
      `}</style>
    </div>
  );
};