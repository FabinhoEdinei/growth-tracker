'use client';

import { useEffect, useState } from 'react';

interface NavSection {
  id: string;
  label: string;
}

const sections: NavSection[] = [
  { id: 'recentes', label: 'Recentes' },
  { id: 'desenvolvimento', label: 'Desenvolvimento' },
  { id: 'tecnico', label: 'Técnico' },
  { id: 'design', label: 'Design' },
];

export const OrganicNav = () => {
  const [activeSection, setActiveSection] = useState(0);

  const scrollToSection = (index: number) => {
    const section = document.getElementById(sections[index].id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      
      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="organic-nav">
      <div className="nav-line"></div>
      {sections.map((section, index) => (
        <button
          key={section.id}
          className={`nav-node ${activeSection === index ? 'active' : ''}`}
          onClick={() => scrollToSection(index)}
          data-label={section.label}
          aria-label={`Ir para ${section.label}`}
        />
      ))}

      <style jsx>{`
        .organic-nav {
          position: fixed;
          top: 50%;
          right: 40px;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .nav-line {
          position: absolute;
          right: 50%;
          top: 20px;
          bottom: 20px;
          width: 2px;
          background: linear-gradient(
            to bottom,
            rgba(0, 255, 136, 0.3),
            rgba(0, 255, 255, 0.6),
            rgba(0, 255, 136, 0.3)
          );
          transform: translateX(50%);
          z-index: -1;
        }

        .nav-node {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(0, 255, 136, 0.4);
          border: none;
          cursor: pointer;
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-node:hover,
        .nav-node.active {
          background: #00ff88;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
          transform: scale(1.5);
        }

        .nav-node::before {
          content: attr(data-label);
          position: absolute;
          right: 25px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          opacity: 0;
          transition: opacity 0.3s;
          white-space: nowrap;
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }

        .nav-node:hover::before {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .organic-nav {
            right: 20px;
            gap: 15px;
          }

          .nav-node::before {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};