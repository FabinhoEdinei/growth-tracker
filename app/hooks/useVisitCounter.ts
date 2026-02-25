'use client';

import { useState, useEffect } from 'react';

interface VisitData {
  count: number;
  date: string; // formato: YYYY-MM-DD
  lastVisit: number; // timestamp
}

const STORAGE_KEY = 'growth_tracker_visits';
const DAILY_RESET_HOUR = 5; // 5h da manhã

export const useVisitCounter = () => {
  const [visitCount, setVisitCount] = useState<number>(0);
  const [isNewVisitor, setIsNewVisitor] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const now = new Date();
    const currentDate = getDateKey(now);
    
    // Buscar dados salvos
    const savedData = localStorage.getItem(STORAGE_KEY);
    let visitData: VisitData;

    if (savedData) {
      visitData = JSON.parse(savedData);
      
      // Verificar se é um novo dia (após 5h da manhã)
      if (visitData.date !== currentDate) {
        // Novo dia - resetar contador
        visitData = {
          count: 1,
          date: currentDate,
          lastVisit: now.getTime(),
        };
        setIsNewVisitor(true);
      } else {
        // Mesmo dia - verificar se é uma nova sessão (> 30 minutos)
        const timeSinceLastVisit = now.getTime() - visitData.lastVisit;
        const thirtyMinutes = 30 * 60 * 1000;

        if (timeSinceLastVisit > thirtyMinutes) {
          visitData.count += 1;
          visitData.lastVisit = now.getTime();
          setIsNewVisitor(true);
        }
      }
    } else {
      // Primeira visita ever
      visitData = {
        count: 1,
        date: currentDate,
        lastVisit: now.getTime(),
      };
      setIsNewVisitor(true);
    }

    // Salvar e atualizar estado
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitData));
    setVisitCount(visitData.count);

  }, []);

  return { visitCount, isNewVisitor };
};

// Helper: gera chave de data considerando reset às 5h
function getDateKey(date: Date): string {
  const adjustedDate = new Date(date);
  
  // Se for antes das 5h, considerar o dia anterior
  if (adjustedDate.getHours() < DAILY_RESET_HOUR) {
    adjustedDate.setDate(adjustedDate.getDate() - 1);
  }
  
  const year = adjustedDate.getFullYear();
  const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
  const day = String(adjustedDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}