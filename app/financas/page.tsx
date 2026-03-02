'use client';

import { PageShell } from '../components/shared/PageShell';
import { ModuleCard } from '../components/shared/ModuleCard';

const ACCOUNTS = [
  { name: 'Conta Principal', balance: 'R$ 4.520,00', change: '+12%', color: '#00ff88' },
  { name: 'Investimentos', balance: 'R$ 12.300,00', change: '+8%', color: '#00d4ff' },
  { name: 'Reserva', balance: 'R$ 3.200,00', change: '+3%', color: '#ffaa00' },
];

const TRANSACTIONS = [
  { name: 'Salario', amount: '+R$ 5.000,00', date: '01/03', type: 'entrada', color: '#00ff88' },
  { name: 'Aluguel', amount: '-R$ 1.200,00', date: '05/03', type: 'saida', color: '#ff0066' },
  { name: 'Investimento CDB', amount: '-R$ 500,00', date: '03/03', type: 'saida', color: '#ff6b9d' },
  { name: 'Freelance', amount: '+R$ 800,00', date: '10/03', type: 'entrada', color: '#00ff88' },
  { name: 'Mercado', amount: '-R$ 420,00', date: '08/03', type: 'saida', color: '#ff0066' },
];

const BUDGET_CATEGORIES = [
  { name: 'Moradia', spent: 1200, total: 1500, color: '#00d4ff' },
  { name: 'Alimentacao', spent: 680, total: 800, color: '#00ff88' },
  { name: 'Transporte', spent: 190, total: 400, color: '#ffaa00' },
  { name: 'Lazer', spent: 250, total: 300, color: '#ff00ff' },
  { name: 'Educacao', spent: 120, total: 500, color: '#a855f7' },
];

export default function FinancasPage() {
  return (
    <PageShell
      title="Financas"
      subtitle="Controle financeiro inteligente"
      accentColor="#ff6b9d"
      accentHue={340}
    >
      {/* Accounts Overview */}
      <div className="accounts-grid">
        {ACCOUNTS.map((acc) => (
          <div key={acc.name} className="account-card">
            <span className="account-name">{acc.name}</span>
            <span className="account-balance" style={{ color: acc.color }}>
              {acc.balance}
            </span>
            <span className="account-change" style={{ color: acc.color }}>
              {acc.change} este mes
            </span>
          </div>
        ))}
      </div>

      <div className="finance-grid">
        {/* Transactions */}
        <ModuleCard
          title="Ultimas Transacoes"
          description="Movimentacoes recentes das suas contas."
          icon="$"
          accentColor="#ff6b9d"
        >
          <div className="transactions-list">
            {TRANSACTIONS.map((tx, i) => (
              <div key={i} className="transaction-item">
                <div className="tx-left">
                  <span
                    className="tx-indicator"
                    style={{ background: tx.color }}
                  />
                  <div className="tx-info">
                    <span className="tx-name">{tx.name}</span>
                    <span className="tx-date">{tx.date}</span>
                  </div>
                </div>
                <span className="tx-amount" style={{ color: tx.color }}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </ModuleCard>

        {/* Budget */}
        <ModuleCard
          title="Orcamento Mensal"
          description="Acompanhe seus gastos por categoria."
          icon="%"
          accentColor="#ffaa00"
          badge="PRO"
        >
          <div className="budget-list">
            {BUDGET_CATEGORIES.map((cat) => {
              const pct = Math.round((cat.spent / cat.total) * 100);
              return (
                <div key={cat.name} className="budget-item">
                  <div className="budget-header">
                    <span className="budget-name">{cat.name}</span>
                    <span className="budget-values">
                      R$ {cat.spent} / R$ {cat.total}
                    </span>
                  </div>
                  <div className="budget-bar">
                    <div
                      className="budget-fill"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)`,
                        boxShadow: pct > 85 ? `0 0 12px ${cat.color}80` : 'none',
                      }}
                    />
                  </div>
                  <span className="budget-pct" style={{ color: pct > 85 ? '#ff0066' : cat.color }}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </ModuleCard>
      </div>

      <style jsx>{`
        .accounts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .account-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 0.3s;
        }

        .account-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .account-name {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .account-balance {
          font-family: 'Orbitron', monospace;
          font-size: 22px;
          font-weight: 700;
        }

        .account-change {
          font-size: 11px;
          font-family: 'Courier New', monospace;
        }

        .finance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .tx-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .tx-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .tx-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .tx-name {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          font-family: 'Courier New', monospace;
        }

        .tx-date {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.3);
          font-family: 'Courier New', monospace;
        }

        .tx-amount {
          font-size: 13px;
          font-family: 'Orbitron', monospace;
          font-weight: bold;
        }

        .budget-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .budget-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .budget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .budget-name {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Courier New', monospace;
        }

        .budget-values {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          font-family: 'Courier New', monospace;
        }

        .budget-bar {
          height: 5px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          overflow: hidden;
        }

        .budget-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .budget-pct {
          font-size: 10px;
          font-family: 'Orbitron', monospace;
          font-weight: bold;
          text-align: right;
        }

        @media (max-width: 768px) {
          .accounts-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .account-balance {
            font-size: 18px;
          }

          .finance-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PageShell>
  );
}
