'use client';

import { useState, useEffect } from 'react';

interface AgendaEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  category: 'jornal' | 'gim' | 'financas' | 'pessoal';
  priority: 'alta' | 'media' | 'baixa';
  done: boolean;
}

interface AgendaModuleProps {
  visible: boolean;
  onClose: () => void;
  positionX: number;
  positionY: number;
}

const CATEGORY_COLORS = {
  jornal: { hue: 200, label: '📰 Jornal', color: '#00aaff' },
  gim: { hue: 140, label: '💪 Gim', color: '#00ff88' },
  financas: { hue: 45, label: '📈 Finanças', color: '#ffaa00' },
  pessoal: { hue: 300, label: '⭐ Pessoal', color: '#ff00ff' },
};

const PRIORITY_STYLES = {
  alta: { color: '#ff0066', label: 'ALTA' },
  media: { color: '#ffaa00', label: 'MÉDIA' },
  baixa: { color: '#00ff88', label: 'BAIXA' },
};

export const AgendaModule: React.FC<AgendaModuleProps> = ({
  visible,
  onClose,
  positionX,
  positionY,
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [events, setEvents] = useState<AgendaEvent[]>([
    {
      id: '1',
      title: 'Treino HIIT',
      time: '07:00',
      date: today,
      category: 'gim',
      priority: 'alta',
      done: false,
    },
    {
      id: '2',
      title: 'Revisão Portfólio',
      time: '09:30',
      date: today,
      category: 'financas',
      priority: 'alta',
      done: false,
    },
    {
      id: '3',
      title: 'Leitura de Notícias',
      time: '12:00',
      date: today,
      category: 'jornal',
      priority: 'media',
      done: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState<'hoje' | 'novo'>('hoje');
  const [newEvent, setNewEvent] = useState<Partial<AgendaEvent>>({
    category: 'pessoal',
    priority: 'media',
    date: today,
    done: false,
  });
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleDone = (id: string) => {
    setEvents(prev =>
      prev.map(e => e.id === id ? { ...e, done: !e.done } : e)
    );
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.time) return;
    
    const event: AgendaEvent = {
      id: Date.now().toString(),
      title: newEvent.title!,
      time: newEvent.time!,
      date: newEvent.date || today,
      category: newEvent.category as AgendaEvent['category'] || 'pessoal',
      priority: newEvent.priority as AgendaEvent['priority'] || 'media',
      done: false,
    };
    
    setEvents(prev => [...prev, event].sort((a, b) => a.time.localeCompare(b.time)));
    setNewEvent({ category: 'pessoal', priority: 'media', date: today, done: false });
    setActiveTab('hoje');
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const todayEvents = events
    .filter(e => e.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));
  
  const doneCount = todayEvents.filter(e => e.done).length;
  const progress = todayEvents.length > 0 ? (doneCount / todayEvents.length) * 100 : 0;

  if (!visible) return null;

  return (
    <div
      className="agenda-overlay"
      style={{
        left: `${Math.min(positionX, window.innerWidth - 360)}px`,
        top: `${Math.min(positionY, window.innerHeight - 500)}px`,
      }}
    >
      {/* Header da Agenda */}
      <div className="agenda-header">
        <div className="agenda-zone-badge">
          <span className="zone-dot"></span>
          ZONA ALPHA
        </div>
        
        <div className="agenda-clock">{currentTime}</div>
        
        <button className="agenda-close" onClick={onClose}>×</button>
      </div>

      {/* Título */}
      <div className="agenda-title-section">
        <h2 className="agenda-title">AGENDA</h2>
        <p className="agenda-date">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
          }).toUpperCase()}
        </p>
      </div>

      {/* Barra de Progresso */}
      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-label">PROGRESSO DO DIA</span>
          <span className="progress-count">{doneCount}/{todayEvents.length}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="progress-percent">{Math.floor(progress)}%</span>
      </div>

      {/* Tabs */}
      <div className="agenda-tabs">
        <button
          className={`tab-btn ${activeTab === 'hoje' ? 'active' : ''}`}
          onClick={() => setActiveTab('hoje')}
        >
          HOJE ({todayEvents.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'novo' ? 'active' : ''}`}
          onClick={() => setActiveTab('novo')}
        >
          + NOVO
        </button>
      </div>

      {/* Lista de Eventos */}
      {activeTab === 'hoje' && (
        <div className="events-list">
          {todayEvents.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <p>Nenhum evento hoje</p>
              <button className="add-btn" onClick={() => setActiveTab('novo')}>
                + Adicionar evento
              </button>
            </div>
          )}
          
          {todayEvents.map(event => {
            const cat = CATEGORY_COLORS[event.category];
            const pri = PRIORITY_STYLES[event.priority];
            
            return (
              <div
                key={event.id}
                className={`event-card ${event.done ? 'done' : ''}`}
                style={{
                  borderLeft: `3px solid ${cat.color}`,
                }}
              >
                <div className="event-left">
                  <button
                    className="event-check"
                    onClick={() => toggleDone(event.id)}
                    style={{
                      borderColor: cat.color,
                      background: event.done ? cat.color : 'transparent',
                    }}
                  >
                    {event.done && '✓'}
                  </button>
                </div>
                
                <div className="event-body">
                  <div className="event-top-row">
                    <span className="event-time">{event.time}</span>
                    <span className="event-category-badge" style={{ color: cat.color }}>
                      {cat.label}
                    </span>
                  </div>
                  <p className="event-title">{event.title}</p>
                  <span
                    className="event-priority"
                    style={{ color: pri.color, borderColor: pri.color }}
                  >
                    {pri.label}
                  </span>
                </div>
                
                <button
                  className="event-delete"
                  onClick={() => deleteEvent(event.id)}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Formulário Novo Evento */}
      {activeTab === 'novo' && (
        <div className="new-event-form">
          <div className="form-group">
            <label className="form-label">TÍTULO</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nome do evento..."
              value={newEvent.title || ''}
              onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label className="form-label">HORA</label>
              <input
                type="time"
                className="form-input"
                value={newEvent.time || ''}
                onChange={e => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>

            <div className="form-group half">
              <label className="form-label">DATA</label>
              <input
                type="date"
                className="form-input"
                value={newEvent.date || today}
                onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">CATEGORIA</label>
            <div className="category-grid">
              {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
                <button
                  key={key}
                  className={`cat-btn ${newEvent.category === key ? 'selected' : ''}`}
                  style={{
                    borderColor: newEvent.category === key ? val.color : 'rgba(255,255,255,0.1)',
                    color: newEvent.category === key ? val.color : 'rgba(255,255,255,0.4)',
                    background: newEvent.category === key ? `${val.color}22` : 'transparent',
                  }}
                  onClick={() => setNewEvent(prev => ({
                    ...prev,
                    category: key as AgendaEvent['category']
                  }))}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">PRIORIDADE</label>
            <div className="priority-row">
              {Object.entries(PRIORITY_STYLES).map(([key, val]) => (
                <button
                  key={key}
                  className={`pri-btn ${newEvent.priority === key ? 'selected' : ''}`}
                  style={{
                    borderColor: newEvent.priority === key ? val.color : 'rgba(255,255,255,0.1)',
                    color: newEvent.priority === key ? val.color : 'rgba(255,255,255,0.3)',
                    background: newEvent.priority === key ? `${val.color}22` : 'transparent',
                  }}
                  onClick={() => setNewEvent(prev => ({
                    ...prev,
                    priority: key as AgendaEvent['priority']
                  }))}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          <button className="submit-btn" onClick={addEvent}>
            <span>+ ADICIONAR EVENTO</span>
          </button>
        </div>
      )}

      <style jsx>{`
        .agenda-overlay {
          position: fixed;
          z-index: 100;
          width: 340px;
          max-height: 580px;
          background: linear-gradient(
            135deg,
            rgba(5, 5, 25, 0.97),
            rgba(10, 5, 35, 0.97)
          );
          border: 2px solid rgba(255, 0, 102, 0.4);
          border-radius: 16px;
          box-shadow:
            0 0 40px rgba(255, 0, 102, 0.3),
            inset 0 0 30px rgba(255, 0, 102, 0.05),
            0 20px 60px rgba(0, 0, 0, 0.8);
          font-family: 'Courier New', monospace;
          overflow: hidden;
          animation: agendaAppear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: auto;
        }

        @keyframes agendaAppear {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Header */
        .agenda-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px 10px;
          border-bottom: 1px solid rgba(255, 0, 102, 0.2);
          background: rgba(255, 0, 102, 0.05);
        }

        .agenda-zone-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 9px;
          color: #ff0066;
          letter-spacing: 2px;
          font-weight: bold;
        }

        .zone-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff0066;
          box-shadow: 0 0 8px #ff0066;
          animation: zonePulse 1.5s ease-in-out infinite;
        }

        @keyframes zonePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .agenda-clock {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 2px;
          font-variant-numeric: tabular-nums;
        }

        .agenda-close {
          background: rgba(255, 0, 102, 0.15);
          border: 1px solid rgba(255, 0, 102, 0.4);
          color: #ff0066;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .agenda-close:hover {
          background: rgba(255, 0, 102, 0.3);
          box-shadow: 0 0 10px rgba(255, 0, 102, 0.5);
        }

        /* Título */
        .agenda-title-section {
          padding: 12px 16px 8px;
        }

        .agenda-title {
          font-size: 22px;
          font-weight: bold;
          background: linear-gradient(135deg, #ff0066, #ff00ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          letter-spacing: 4px;
          text-shadow: 0 0 20px rgba(255, 0, 102, 0.5);
        }

        .agenda-date {
          font-size: 9px;
          color: rgba(255, 0, 102, 0.6);
          letter-spacing: 2px;
          margin-top: 2px;
        }

        /* Progress */
        .progress-section {
          padding: 8px 16px 12px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .progress-label {
          font-size: 8px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 1px;
        }

        .progress-count {
          font-size: 9px;
          color: #ff0066;
          letter-spacing: 1px;
        }

        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff0066, #ff00ff);
          border-radius: 4px;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 0 10px rgba(255, 0, 102, 0.8);
        }

        .progress-percent {
          font-size: 8px;
          color: rgba(255, 0, 102, 0.6);
          letter-spacing: 1px;
        }

        /* Tabs */
        .agenda-tabs {
          display: flex;
          border-bottom: 1px solid rgba(255, 0, 102, 0.2);
          margin-bottom: 2px;
        }

        .tab-btn {
          flex: 1;
          padding: 8px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.4);
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }

        .tab-btn.active {
          color: #ff0066;
          border-bottom-color: #ff0066;
          text-shadow: 0 0 10px rgba(255, 0, 102, 0.5);
        }

        .tab-btn:hover {
          color: rgba(255, 0, 102, 0.7);
        }

        /* Lista de eventos */
        .events-list {
          padding: 8px 12px;
          max-height: 300px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 0, 102, 0.3) transparent;
        }

        .empty-state {
          text-align: center;
          padding: 30px 20px;
          color: rgba(255,255,255,0.3);
          font-size: 12px;
        }

        .empty-icon {
          font-size: 30px;
          display: block;
          margin-bottom: 10px;
        }

        .add-btn {
          margin-top: 12px;
          padding: 8px 20px;
          background: rgba(255, 0, 102, 0.1);
          border: 1px solid rgba(255, 0, 102, 0.4);
          color: #ff0066;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          transition: all 0.2s;
        }

        .add-btn:hover {
          background: rgba(255, 0, 102, 0.2);
          box-shadow: 0 0 15px rgba(255, 0, 102, 0.3);
        }

        .event-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          margin-bottom: 8px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border-left: 3px solid;
          transition: all 0.3s;
          position: relative;
        }

        .event-card.done {
          opacity: 0.4;
        }

        .event-card.done .event-title {
          text-decoration: line-through;
        }

        .event-card:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .event-left {
          flex-shrink: 0;
        }

        .event-check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #000;
          transition: all 0.2s;
          font-weight: bold;
        }

        .event-body {
          flex: 1;
          min-width: 0;
        }

        .event-top-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .event-time {
          font-size: 10px;
          color: rgba(255,255,255,0.6);
          letter-spacing: 1px;
        }

        .event-category-badge {
          font-size: 8px;
          letter-spacing: 1px;
        }

        .event-title {
          font-size: 12px;
          color: rgba(255,255,255,0.9);
          margin: 0 0 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .event-priority {
          font-size: 8px;
          padding: 2px 6px;
          border: 1px solid;
          border-radius: 3px;
          letter-spacing: 1px;
        }

        .event-delete {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.2);
          font-size: 16px;
          cursor: pointer;
          padding: 0 4px;
          transition: color 0.2s;
          flex-shrink: 0;
        }

        .event-delete:hover {
          color: #ff0066;
        }

        /* Form */
        .new-event-form {
          padding: 12px 14px;
          max-height: 350px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 0, 102, 0.3) transparent;
        }

        .form-group {
          margin-bottom: 12px;
        }

        .form-group.half {
          flex: 1;
        }

        .form-row {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
        }

        .form-label {
          display: block;
          font-size: 8px;
          color: rgba(255, 0, 102, 0.7);
          letter-spacing: 2px;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 0, 102, 0.2);
          border-radius: 6px;
          padding: 8px 10px;
          color: rgba(255,255,255,0.9);
          font-family: 'Courier New', monospace;
          font-size: 11px;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
          color-scheme: dark;
        }

        .form-input:focus {
          border-color: rgba(255, 0, 102, 0.6);
          box-shadow: 0 0 15px rgba(255, 0, 102, 0.2);
          background: rgba(255, 255, 255, 0.08);
        }

        .form-input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .category-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .cat-btn {
          padding: 7px 10px;
          background: transparent;
          border: 1px solid;
          border-radius: 6px;
          cursor: pointer;
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
          transition: all 0.2s;
          text-align: left;
        }

        .priority-row {
          display: flex;
          gap: 6px;
        }

        .pri-btn {
          flex: 1;
          padding: 7px;
          background: transparent;
          border: 1px solid;
          border-radius: 6px;
          cursor: pointer;
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
          transition: all 0.2s;
          text-align: center;
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, rgba(255, 0, 102, 0.2), rgba(255, 0, 255, 0.2));
          border: 1px solid rgba(255, 0, 102, 0.5);
          border-radius: 8px;
          color: #ff0066;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 8px;
        }

        .submit-btn:hover {
          background: linear-gradient(135deg, rgba(255, 0, 102, 0.4), rgba(255, 0, 255, 0.3));
          box-shadow: 0 0 25px rgba(255, 0, 102, 0.4);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};