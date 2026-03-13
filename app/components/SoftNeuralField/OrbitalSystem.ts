// OrbitalSystem.ts
// Gerenciador central — cria, atualiza e expõe os hexágonos orbitais
// COMPLETAMENTE ISOLADO: não importa nada de partículas normais

import { OrbitalParticle, OrbitalPayload, OrbitalDataType } from './orbitalTypes';
import { createOrbitalParticle, updateOrbital, orbitalHitTest } from './orbitalEngine';
import { renderAllOrbitals } from './orbitalRenderer';
import { HeaderBounds } from './types';

// ── Resultado de uma sincronização com API ────────────────────────────────────
export interface SyncResult {
  added:   number;
  updated: number;
  removed: number;
}

export class OrbitalSystem {
  private particles:    OrbitalParticle[] = [];
  private headerBounds: HeaderBounds | null = null;

  // ── Init com payloads fixos (fallback / dev) ──────────────────────────────
  init(payloads: OrbitalPayload[]): void {
    this.particles = payloads.map((payload, i) =>
      createOrbitalParticle(payload, i, payloads.length)
    );
  }

  // ── Adiciona em runtime ───────────────────────────────────────────────────
  add(payload: OrbitalPayload): void {
    const p = createOrbitalParticle(
      payload,
      this.particles.length,
      this.particles.length + 1
    );
    this.particles.push(p);
  }

  // ── Remove por id ─────────────────────────────────────────────────────────
  remove(id: string): void {
    this.particles = this.particles.filter(p => p.id !== id);
  }

  // ── Atualiza payload de uma partícula existente ───────────────────────────
  updatePayload(id: string, patch: Partial<OrbitalPayload>): void {
    const p = this.particles.find(p => p.id === id);
    if (p) p.payload = { ...p.payload, ...patch };
  }

  // ── Remove todos os orbitais de um tipo ───────────────────────────────────
  clearType(type: OrbitalDataType): void {
    this.particles = this.particles.filter(p => p.payload.type !== type);
  }

  // ── Substitui todos os orbitais de um tipo de uma vez ────────────────────
  replaceType(type: OrbitalDataType, payloads: OrbitalPayload[]): void {
    this.clearType(type);
    payloads.forEach(payload => this.add(payload));
    this.reindex();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // syncFromAPI — coração da integração
  //
  // Recebe payloads novos (vindos de qualquer API), compara com o estado
  // atual e faz diff: adiciona novos, atualiza existentes, remove ausentes
  // dentro do mesmo type. Retorna relatório da sincronização.
  // ─────────────────────────────────────────────────────────────────────────
  syncFromAPI(
    type: OrbitalDataType,
    incoming: OrbitalPayload[]
  ): SyncResult {
    const result: SyncResult = { added: 0, updated: 0, removed: 0 };

    const existing = this.particles.filter(p => p.payload.type === type);
    const incomingLabels = new Set(incoming.map(p => p.label));

    // Remove orbitais que sumiram da API
    const toRemove = existing.filter(p => !incomingLabels.has(p.payload.label));
    toRemove.forEach(p => this.remove(p.id));
    result.removed = toRemove.length;

    // Adiciona ou atualiza
    for (const payload of incoming) {
      const found = this.particles.find(
        p => p.payload.type === type && p.payload.label === payload.label
      );
      if (found) {
        // Atualiza campos dinâmicos sem resetar posição orbital
        found.payload = { ...found.payload, ...payload };
        result.updated++;
      } else {
        this.add(payload);
        result.added++;
      }
    }

    this.reindex();
    return result;
  }

  // ── Reindexação — redistribui ângulos após mudanças ──────────────────────
  private reindex(): void {
    const total = this.particles.length;
    if (total === 0) return;
    const step = (Math.PI * 2) / total;
    this.particles.forEach((p, i) => {
      // Só ajusta se o ângulo estiver muito fora do esperado (evita saltos visuais)
      const expected = step * i;
      const diff = Math.abs(p.angle - expected);
      if (diff > Math.PI) {
        p.angle = expected;
      }
    });
  }

  // ── Header bounds ─────────────────────────────────────────────────────────
  setHeaderBounds(bounds: HeaderBounds): void {
    this.headerBounds = bounds;
  }

  // ── Loop principal ────────────────────────────────────────────────────────
  update(): void {
    if (!this.headerBounds) return;
    for (const p of this.particles) {
      updateOrbital(p, this.headerBounds);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    renderAllOrbitals(ctx, this.particles);
  }

  // ── Interação ─────────────────────────────────────────────────────────────
  handleClick(mx: number, my: number): OrbitalParticle | null {
    this.particles.forEach(p => (p.highlighted = false));
    const hit = orbitalHitTest(this.particles, mx, my, 20);
    if (hit) hit.highlighted = true;
    return hit;
  }

  // ── Queries ───────────────────────────────────────────────────────────────
  getAll(): OrbitalParticle[] {
    return this.particles;
  }

  getByType(type: OrbitalDataType): OrbitalParticle[] {
    return this.particles.filter(p => p.payload.type === type);
  }

  getDueSoon(windowMs = 3_600_000): OrbitalParticle[] {
    const now = Date.now();
    return this.particles.filter(p => {
      if (!p.payload.dueAt) return false;
      const diff = p.payload.dueAt - now;
      return diff > 0 && diff <= windowMs;
    });
  }

  getCount(): number {
    return this.particles.length;
  }

  getCountByType(type: OrbitalDataType): number {
    return this.particles.filter(p => p.payload.type === type).length;
  }

  // ── Snapshot para debug ───────────────────────────────────────────────────
  snapshot(): Record<OrbitalDataType, number> {
    const types: OrbitalDataType[] = ['agenda','financas','saude','meta','etf','blog','tv','jornal'];
    return Object.fromEntries(
      types.map(t => [t, this.getCountByType(t)])
    ) as Record<OrbitalDataType, number>;
  }
}

// ── Singleton global ──────────────────────────────────────────────────────────
export const orbitalSystem = new OrbitalSystem();

// ── Payloads iniciais (agenda/saúde/meta/financas — dados pessoais fixos) ─────
// Blog, ETF, TV e Jornal serão injetados via syncFromAPI() pelas APIs reais
export const INITIAL_ORBITAL_PAYLOADS: OrbitalPayload[] = [
  {
    type: 'agenda',
    label: 'Treino HIIT',
    done: false,
    priority: 1,
    dueAt: Date.now() + 3_600_000,
  },
  {
    type: 'agenda',
    label: 'Revisão portfólio',
    done: false,
    priority: 1,
    dueAt: Date.now() + 7_200_000,
  },
  {
    type: 'financas',
    label: 'Aporte mensal',
    value: 500.00,
    priority: 2,
  },
  {
    type: 'financas',
    label: 'Verificar BTC',
    value: 0,
    priority: 2,
  },
  {
    type: 'saude',
    label: 'Água: 2L',
    done: false,
    priority: 2,
  },
  {
    type: 'meta',
    label: 'Leitura 30min',
    done: false,
    priority: 3,
  },
];
