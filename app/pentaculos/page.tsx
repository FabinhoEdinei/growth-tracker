// ── GradeBrick Component (New Brick Wall Grid) ───────────────────────────────
function GradeBrick({ 
  tokens, 
  onComprar, 
  onDownload,
  filtro 
}: { 
  tokens: CotaETF[]; 
  onComprar: (c: CotaETF) => void; 
  onDownload: (c: CotaETF) => void;
  filtro: 'todos' | 'disponivel' | 'vendida';
}) {
  const totalTokens = tokens.length;
  const totalValor = totalTokens * 3600;
  
  return (
    <div style={{ marginTop: 36 }}>
      {/* Cabeçalho da Grade */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10,
          padding: '8px 16px',
          background: 'rgba(168,85,247,0.1)',
          border: '2px solid rgba(168,85,247,0.4)',
          borderRadius: 12,
          fontFamily: "'Courier New', monospace"
        }}>
          <span style={{ 
            fontSize: 14, 
            fontWeight: 700,
            letterSpacing: 3,
            color: '#a855f7',
            textShadow: '0 0 10px rgba(168,85,247,0.5)'
          }}>
            ✦ GRADE
          </span>
          <span style={{ 
            fontSize: 11,
            background: 'rgba(168,85,247,0.2)',
            color: '#a855f7',
            padding: '2px 10px',            borderRadius: 20,
            border: '1px solid rgba(168,85,247,0.3)'
          }}>
            {totalTokens} TOKEN{totalTokens !== 1 ? 'S' : ''}
          </span>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['todos', 'disponivel', 'vendida'] as const).map(f => (
            <button 
              key={f} 
              onClick={() => setFiltroGrade(f)}
              style={{ 
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 10,
                cursor: 'pointer',
                background: filtro === f ? 'rgba(168,85,247,0.25)' : 'rgba(168,85,247,0.08)',
                border: `2px solid ${filtro === f ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.25)'}`,
                color: filtro === f ? '#a855f7' : 'rgba(168,85,247,0.5)',
                fontFamily: "'Courier New', monospace",
                letterSpacing: 1,
                transition: 'all 0.2s',
                fontWeight: filtro === f ? 700 : 400
              }}
              onMouseEnter={e => {
                if (filtro !== f) {
                  e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)';
                  e.currentTarget.style.background = 'rgba(168,85,247,0.15)';
                }
              }}
              onMouseLeave={e => {
                if (filtro !== f) {
                  e.currentTarget.style.borderColor = 'rgba(168,85,247,0.25)';
                  e.currentTarget.style.background = 'rgba(168,85,247,0.08)';
                }
              }}
            >
              {f === 'todos' ? `TODOS` : f === 'disponivel' ? `DISP.` : `VEND.`}
            </button>
          ))}
        </div>
      </div>

      {/* Grade estilo Parede de Tijolos */}
      {tokens.length === 0 ? (
        <div style={{ 
          textAlign: 'center',
          padding: '60px 20px',          border: '3px dashed rgba(168,85,247,0.3)',
          borderRadius: 16,
          background: 'rgba(168,85,247,0.03)',
          fontFamily: "'Courier New', monospace"
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔮</div>
          <p style={{ fontSize: 13, color: 'rgba(168,85,247,0.5)', margin: 0 }}>
            Nenhum token gerado ainda
          </p>
          <p style={{ fontSize: 11, color: 'rgba(168,85,247,0.3)', marginTop: 6 }}>
            Clique em <strong style={{ color: '#00ff88' }}>+ Token</strong> para criar
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 0,
          border: '3px solid rgba(168,85,247,0.4)',
          borderRadius: 16,
          overflow: 'hidden',
          background: 'rgba(168,85,247,0.03)',
          boxShadow: '0 0 40px rgba(168,85,247,0.1), inset 0 0 60px rgba(168,85,247,0.05)'
        }}>
          {tokens.map((t, index) => (
            <div 
              key={t.id}
              style={{ 
                position: 'relative',
                borderRight: index % 3 !== 2 && index !== tokens.length - 1 ? '2px solid rgba(168,85,247,0.25)' : 'none',
                borderBottom: '2px solid rgba(168,85,247,0.25)',
                background: t.status === 'vendida' 
                  ? 'rgba(168,85,247,0.06)' 
                  : 'rgba(0,255,136,0.03)',
                padding: '18px 16px',
                minHeight: 180,
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = t.status === 'vendida'
                  ? 'rgba(168,85,247,0.12)'
                  : 'rgba(0,255,136,0.06)';
                e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(168,85,247,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = t.status === 'vendida'
                  ? 'rgba(168,85,247,0.06)'
                  : 'rgba(0,255,136,0.03)';
                e.currentTarget.style.boxShadow = 'none';              }}
            >
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: 10,
                right: 10,
                padding: '3px 10px',
                borderRadius: 12,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1,
                background: t.status === 'vendida' 
                  ? 'rgba(168,85,247,0.2)' 
                  : 'rgba(0,255,136,0.15)',
                border: `1px solid ${t.status === 'vendida' ? 'rgba(168,85,247,0.4)' : 'rgba(0,255,136,0.3)'}`,
                color: t.status === 'vendida' ? '#a855f7' : '#00ff88',
                fontFamily: "'Courier New', monospace"
              }}>
                {t.status === 'vendida' ? '🔒 VENDIDA' : '🔓 DISPONÍVEL'}
              </div>

              {/* ID do Token */}
              <div style={{ 
                fontSize: 10, 
                color: 'rgba(168,85,247,0.4)', 
                marginBottom: 10,
                fontFamily: "'Courier New', monospace",
                letterSpacing: 1
              }}>
                {t.id}
              </div>

              {/* Código (parcial) */}
              <div style={{ 
                fontSize: 11, 
                fontFamily: "'Courier New', monospace",
                color: 'rgba(255,255,255,0.2)',
                marginBottom: 12,
                padding: '6px 8px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 6,
                letterSpacing: 2
              }}>
                {t.codigoCompleto.slice(0, 12)}...
              </div>

              {/* Valor */}
              <div style={{ 
                fontSize: 18,                 fontWeight: 900, 
                color: t.status === 'vendida' ? '#a855f7' : '#00ff88',
                fontFamily: "'Courier New', monospace",
                marginBottom: 8,
                textShadow: t.status === 'vendida' 
                  ? '0 0 12px rgba(168,85,247,0.4)' 
                  : '0 0 12px rgba(0,255,136,0.4)'
              }}>
                R$ 3.600
              </div>

              {/* Dono (se vendida) */}
              {t.dono && (
                <div style={{ 
                  fontSize: 10, 
                  color: 'rgba(168,85,247,0.6)',
                  marginBottom: 10,
                  fontFamily: "'Courier New', monospace",
                  padding: '4px 8px',
                  background: 'rgba(168,85,247,0.1)',
                  borderRadius: 6,
                  border: '1px solid rgba(168,85,247,0.2)'
                }}>
                  👤 {t.dono}
                </div>
              )}

              {/* Botões de Ação */}
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button 
                  onClick={() => onDownload(t)}
                  style={{ 
                    flex: 1,
                    padding: '6px 8px',
                    background: 'rgba(0,212,255,0.1)',
                    border: '1px solid rgba(0,212,255,0.3)',
                    borderRadius: 6,
                    color: '#00d4ff',
                    cursor: 'pointer',
                    fontSize: 9,
                    fontFamily: "'Courier New', monospace",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)';                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
                  }}
                >
                  <Download size={10}/> CERT.
                </button>
                
                {t.status !== 'vendida' && (
                  <button 
                    onClick={() => onComprar(t)}
                    style={{ 
                      flex: 2,
                      padding: '6px 8px',
                      background: 'rgba(168,85,247,0.15)',
                      border: '1px solid rgba(168,85,247,0.4)',
                      borderRadius: 6,
                      color: '#a855f7',
                      cursor: 'pointer',
                      fontSize: 9,
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(168,85,247,0.25)';
                      e.currentTarget.style.borderColor = 'rgba(168,85,247,0.6)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(168,85,247,0.15)';
                      e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)';
                    }}
                  >
                    <ShoppingCart size={10}/> COMPRAR
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rodapé da Grade - Quantidade Total e Download */}
      {tokens.length > 0 && (
        <div style={{           display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 16,
          padding: '14px 18px',
          background: 'rgba(168,85,247,0.08)',
          border: '2px solid rgba(168,85,247,0.3)',
          borderRadius: 12,
          fontFamily: "'Courier New', monospace"
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              fontSize: 11, 
              color: 'rgba(168,85,247,0.6)',
              letterSpacing: 2
            }}>
              QUANTIDADE TOTAL
            </div>
            <div style={{ 
              fontSize: 16, 
              fontWeight: 900, 
              color: '#a855f7',
              textShadow: '0 0 10px rgba(168,85,247,0.4)'
            }}>
              {totalTokens}
            </div>
            <div style={{ 
              width: 1, 
              height: 20, 
              background: 'rgba(168,85,247,0.3)',
              margin: '0 8px'
            }}/>
            <div style={{ fontSize: 11, color: 'rgba(168,85,247,0.5)' }}>
              VALOR TOTAL:
            </div>
            <div style={{ 
              fontSize: 14, 
              fontWeight: 700, 
              color: '#00ff88',
              fontFamily: "'Courier New', monospace"
            }}>
              R$ {totalValor.toLocaleString('pt-BR')}
            </div>
          </div>

          <button 
            onClick={() => tokens.forEach(t => onDownload(t))}
            style={{ 
              display: 'flex',
              alignItems: 'center',              gap: 8,
              padding: '8px 16px',
              background: 'rgba(168,85,247,0.15)',
              border: '2px solid rgba(168,85,247,0.4)',
              borderRadius: 10,
              color: '#a855f7',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "'Courier New', monospace",
              letterSpacing: 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(168,85,247,0.25)';
              e.currentTarget.style.borderColor = 'rgba(168,85,247,0.6)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(168,85,247,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(168,85,247,0.15)';
              e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Download size={14}/> DOWNLOAD TODOS
          </button>
        </div>
      )}
    </div>
  );
}