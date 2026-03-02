'use client';

import { useState } from 'react';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  children?: React.ReactNode;
  badge?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  accentColor,
  children,
  badge,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="module-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="top-accent"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />

      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <div className="card-title-group">
          <h3 className="card-title">{title}</h3>
          {badge && (
            <span className="card-badge" style={{ background: accentColor }}>
              {badge}
            </span>
          )}
        </div>
      </div>

      <p className="card-description">{description}</p>

      {children && <div className="card-body">{children}</div>}

      <svg className="leaf-veins" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M 10 50 Q 30 30, 50 50 T 90 50"
          stroke={accentColor}
          strokeWidth="0.5"
          fill="none"
          opacity="0.15"
        />
        <path
          d="M 20 40 Q 35 35, 50 40"
          stroke={accentColor}
          strokeWidth="0.3"
          fill="none"
          opacity="0.1"
        />
      </svg>

      <style jsx>{`
        .module-card {
          position: relative;
          background: linear-gradient(
            135deg,
            rgba(10, 26, 40, 0.95),
            rgba(45, 90, 61, 0.1)
          );
          backdrop-filter: blur(10px);
          border: 1.5px solid ${accentColor}4d;
          border-radius: 20px 0 20px 0;
          padding: 28px;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(30px);
          animation: cardGrow 0.8s ease-out forwards;
        }

        @keyframes cardGrow {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .module-card:hover {
          border-color: ${accentColor}99;
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 20px 50px ${accentColor}33;
        }

        .top-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
          position: relative;
          z-index: 1;
        }

        .card-icon {
          font-size: 28px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          border: 1.5px solid ${accentColor}4d;
          flex-shrink: 0;
        }

        .card-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .card-title {
          font-family: 'Courier New', monospace;
          font-size: 18px;
          font-weight: bold;
          color: rgba(255, 255, 255, 0.95);
          margin: 0;
          letter-spacing: 1px;
        }

        .card-badge {
          font-size: 8px;
          padding: 3px 8px;
          border-radius: 4px;
          color: #000;
          font-weight: bold;
          letter-spacing: 1.5px;
          font-family: 'Courier New', monospace;
        }

        .card-description {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          line-height: 1.7;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .card-body {
          position: relative;
          z-index: 1;
        }

        .leaf-veins {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.3;
          z-index: 0;
        }

        @media (max-width: 768px) {
          .module-card {
            padding: 20px;
            border-radius: 16px 0 16px 0;
          }

          .card-title {
            font-size: 15px;
          }

          .card-description {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};
