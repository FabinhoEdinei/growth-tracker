'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Microscope, 
  TrendingUp, 
  FileText, 
  Activity,
  Droplets,
  Dna
} from 'lucide-react';

// Dados mockados para o dashboard - substituir por dados reais do blog
const blogStats = {
  totalPosts: 24,
  postsThisMonth: 3,
  viewsThisWeek: 1250,
  growthRate: 15.5,
  postsByCategory: [
    { name: 'Pesquisa', count: 8, color: '#00ff88' },
    { name: 'Cultivo', count: 6, color: '#00cc6a' },
    { name: 'Análise', count: 5, color: '#00994d' },
    { name: 'Outros', count: 5, color: '#006633' },
  ],
  monthlyData: [
    { month: 'Jan', posts: 2 },
    { month: 'Fev', posts: 3 },
    { month: 'Mar', posts: 4 },
    { month: 'Abr', posts: 2 },
    { month: 'Mai', posts: 5 },
    { month: 'Jun', posts: 3 },
  ]
};

export default function DashboardAlgasPage() {
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Componente de gráfico de barras simples
  const BarChart = ({ data }: { data: { month: string; posts: number }[] }) => {
    const maxValue = Math.max(...data.map(d => d.posts));
    
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'space-around',
        height: '120px',
        gap: '8px',
        padding: '10px 0'
      }}>
        {data.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            flex: 1
          }}>
            <div style={{
              width: '100%',
              maxWidth: '30px',
              height: `${(item.posts / maxValue) * 80}px`,
              background: `linear-gradient(to top, #00ff88, rgba(0,255,136,0.3))`,
              borderRadius: '4px 4px 0 0',
              transition: 'all 0.3s ease',
              boxShadow: hoveredCard === index ? '0 0 20px rgba(0,255,136,0.5)' : 'none',
              animation: mounted ? `growUp 0.8s ease-out ${index * 0.1}s both` : 'none'
            }} />
            <span style={{ 
              fontSize: '10px', 
              color: 'rgba(0,255,136,0.7)', 
              marginTop: '5px',
              fontFamily: 'Courier New, monospace'
            }}>
              {item.month}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Componente de gráfico de pizza/donut
  const DonutChart = ({ data }: { data: { name: string; count: number; color: string }[] }) => {
    const total = data.reduce((acc, item) => acc + item.count, 0);
    let currentAngle = 0;

    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {data.map((item, index) => {
            const angle = (item.count / total) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;
            const endAngle = currentAngle;
            
            const x1 = 60 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 60 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 60 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = 60 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArc = angle > 180 ? 1 : 0;
            
            return (
              <path
                key={index}
                d={`M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={item.color}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth="1"
                style={{
                  opacity: hoveredCard === index ? 1 : 0.8,
                  transition: 'opacity 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              />
            );
          })}
          <circle cx="60" cy="60" r="30" fill="rgba(10,10,30,0.9)" />
          <text x="60" y="65" textAnchor="middle" fill="#00ff88" fontSize="14" fontWeight="bold">
            {total}
          </text>
        </svg>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: '12px',
                color: hoveredCard === index ? '#00ff88' : 'rgba(0,255,136,0.7)',
                transition: 'color 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: item.color,
                borderRadius: '2px',
                boxShadow: `0 0 10px ${item.color}`
              }} />
              <span>{item.name}: {item.count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 50%, rgba(10,10,30,1), rgba(0,0,0,1))',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Courier New, monospace',
      color: '#00ff88',
    }}>
      {/* Fundo animado - Efeito de água/vida */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.4
      }}>
        {/* Camada 1: Ondas lentas */}
        <div style={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(0,255,136,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(0,200,100,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(0,150,80,0.08) 0%, transparent 60%)
          `,
          animation: 'float1 20s ease-in-out infinite',
          filter: 'blur(40px)'
        }} />
        
        {/* Camada 2: Ondas médias */}
        <div style={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
          background: `
            radial-gradient(ellipse at 70% 20%, rgba(0,255,136,0.12) 0%, transparent 40%),
            radial-gradient(ellipse at 30% 80%, rgba(0,180,90,0.08) 0%, transparent 45%)
          `,
          animation: 'float2 15s ease-in-out infinite',
          filter: 'blur(30px)'
        }} />
        
        {/* Camada 3: Partículas/orgânico */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(0,255,136,0.3) 1px, transparent 1px),
            radial-gradient(circle at 60% 70%, rgba(0,255,136,0.2) 1px, transparent 1px),
            radial-gradient(circle at 40% 50%, rgba(0,255,136,0.25) 1px, transparent 1px),
            radial-gradient(circle at 80% 20%, rgba(0,255,136,0.15) 1px, transparent 1px),
            radial-gradient(circle at 10% 80%, rgba(0,255,136,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 150px 150px, 80px 80px, 120px 120px, 90px 90px',
          animation: 'particles 25s linear infinite',
          opacity: 0.6
        }} />
      </div>

      {/* Botão Voltar Estilizado */}
      <Link href="/" style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 100,
        textDecoration: 'none'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          background: 'rgba(0,255,136,0.1)',
          border: '1px solid rgba(0,255,136,0.3)',
          borderRadius: '30px',
          color: '#00ff88',
          fontFamily: 'Courier New, monospace',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0,255,136,0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,255,136,0.2)';
          e.currentTarget.style.boxShadow = '0 0 25px rgba(0,255,136,0.4)';
          e.currentTarget.style.transform = 'translateX(-5px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,255,136,0.1)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,255,136,0.1)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
        >
          <ArrowLeft size={18} style={{ 
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          <span>Voltar</span>
          <Dna size={14} style={{ 
            marginLeft: '4px',
            opacity: 0.7,
            animation: 'spin 10s linear infinite'
          }} />
        </div>
      </Link>

      {/* Conteúdo Principal */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '80px 20px 40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          animation: mounted ? 'fadeInDown 0.8s ease-out' : 'none'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '10px',
            animation: 'float 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 20px rgba(0,255,136,0.5))'
          }}>
            🦠
          </div>
          <h1 style={{ 
            fontSize: '32px', 
            marginBottom: '10px',
            textShadow: '0 0 20px rgba(0,255,136,0.5)',
            letterSpacing: '2px'
          }}>
            Dashboard Algas
          </h1>
          <p style={{ 
            fontSize: '14px', 
            color: 'rgba(0,255,136,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <Activity size={14} />
            Sistema de Monitoramento Neural
            <Activity size={14} />
          </p>
        </div>

        {/* Grid de Estatísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Card 1: Total de Posts */}
          <div style={{
            background: 'rgba(0,255,136,0.05)',
            border: '1px solid rgba(0,255,136,0.2)',
            borderRadius: '15px',
            padding: '25px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            animation: mounted ? 'fadeInUp 0.8s ease-out 0.2s both' : 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,255,136,0.2)';
            e.currentTarget.style.borderColor = 'rgba(0,255,136,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(0,255,136,0.2)';
          }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '15px'
            }}>
              <FileText size={24} style={{ opacity: 0.8 }} />
              <span style={{
                background: 'rgba(0,255,136,0.2)',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                color: '#00ff88'
              }}>
                +{blogStats.postsThisMonth} este mês
              </span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>
              {blogStats.totalPosts}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(0,255,136,0.6)' }}>
              Total de Posts do Blog
            </div>
          </div>

          {/* Card 2: Visualizações */}
          <div style={{
            background: 'rgba(0,255,136,0.05)',
            border: '1px solid rgba(0,255,136,0.2)',
            borderRadius: '15px',
            padding: '25px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            animation: mounted ? 'fadeInUp 0.8s ease-out 0.3s both' : 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,255,136,0.2)';
            e.currentTarget.style.borderColor = 'rgba(0,255,136,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(0,255,136,0.2)';
          }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '15px'
            }}>
              <Microscope size={24} style={{ opacity: 0.8 }} />
              <TrendingUp size={16} style={{ color: '#00ff88' }} />
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>
              {blogStats.viewsThisWeek.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(0,255,136,0.6)' }}>
              Visualizações esta semana
            </div>
          </div>

          {/* Card 3: Taxa de Crescimento */}
          <div style={{
            background: 'rgba(0,255,136,0.05)',
            border: '1px solid rgba(0,255,136,0.2)',
            borderRadius: '15px',
            padding: '25px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            animation: mounted ? 'fadeInUp 0.8s ease-out 0.4s both' : 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,255,136,0.2)';
            e.currentTarget.style.borderColor = 'rgba(0,255,136,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(0,255,136,0.2)';
          }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '15px'
            }}>
              <Droplets size={24} style={{ opacity: 0.8 }} />
              <span style={{
                background: 'rgba(0,255,136,0.2)',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                color: '#00ff88'
              }}>
                +{blogStats.growthRate}%
              </span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>
              {blogStats.growthRate}%
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(0,255,136,0.6)' }}>
              Taxa de Crescimento
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {/* Gráfico de Barras */}
          <div style={{
            background: 'rgba(0,255,136,0.05)',
            border: '1px solid rgba(0,255,136,0.2)',
            borderRadius: '15px',
            padding: '25px',
            backdropFilter: 'blur(10px)',
            animation: mounted ? 'fadeInUp 0.8s ease-out 0.5s both' : 'none'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Activity size={18} />
              Posts por Mês
            </h3>
            <BarChart data={blogStats.monthlyData} />
          </div>

          {/* Gráfico de Categorias */}
          <div style={{
            background: 'rgba(0,255,136,0.05)',
            border: '1px solid rgba(0,255,136,0.2)',
            borderRadius: '15px',
            padding: '25px',
            backdropFilter: 'blur(10px)',
            animation: mounted ? 'fadeInUp 0.8s ease-out 0.6s both' : 'none'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Dna size={18} />
              Distribuição por Categoria
            </h3>
            <DonutChart data={blogStats.postsByCategory} />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          borderTop: '1px solid rgba(0,255,136,0.1)',
          fontSize: '12px',
          color: 'rgba(0,255,136,0.4)',
          animation: mounted ? 'fadeIn 1s ease-out 0.8s both' : 'none'
        }}>
          <p>🧬 Neural Growth System - Dashboard de Algas</p>
          <p style={{ marginTop: '5px' }}>Dados atualizados em tempo real</p>
        </div>
      </div>

      {/* Styles globais para animações */}
      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-40px, 40px) rotate(180deg); }
        }
        
        @keyframes particles {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-100px) rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes growUp {
          from {
            transform: scaleY(0);
            transform-origin: bottom;
          }
          to {
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }
      `}</style>
    </div>
  );
}
