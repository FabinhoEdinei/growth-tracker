// OrbitalSystem.ts
// Gerenciador central — cria, atualiza e expõe os hexágonos orbitais
// COMPLETAMENTE ISOLADO: não importa nada de partículas normais

import { OrbitalParticle, OrbitalPayload, OrbitalDataType } from './orbitalTypes';
import { createOrbitalParticle, updateOrbital, orbitalHitTest } from './orbitalEngine';
import { renderAllOrbitals } from './orbitalRenderer';
import { HeaderBounds } from './types';

export class OrbitalSystem {
  private particles: OrbitalParticle[] = [];
  private headerBounds: HeaderBounds | null = null;

  // ── Inicializa com dados fixos ───────────────────────────────────
  init(payloads: OrbitalPayload[]): void {
    this.particles = payloads.map((payload, i) =>
      createOrbitalParticle(payload, i, payloads.length)
    );
  }

  // Adiciona uma partícula orbital em runtime
  add(payload: OrbitalPayload): void {
    const p = createOrbitalParticle(
      payload,
      this.particles.length,
      this.particles.length + 1
    );
    this.particles.push(p);
  }

  // Remove por id
  remove(id: string): void {
    this.particles = this.particles.filter(p => p.id !== id);
  }

  // Atualiza payload de uma partícula
  updatePayload(id: string, patch: Partial<OrbitalPayload>): void {
    const p = this.particles.find(p => p.id === id);
    if (p) p.payload = { ...p.payload, ...patch };
  }

  // ── Header bounds (vem do NeuralHeader) ─────────────────────────
  setHeaderBounds(bounds: HeaderBounds): void {
    this.headerBounds = bounds;
  }

  // ── Loop principal ───────────────────────────────────────────────
  update(): void {
    if (!this.headerBounds) return;
    for (const p of this.particles) {
      updateOrbital(p, this.headerBounds);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    renderAllOrbitals(ctx, this.particles);
  }

  // ── Interação ────────────────────────────────────────────────────
  handleClick(mx: number, my: number): OrbitalParticle | null {
    // Reset highlights
    this.particles.forEach(p => (p.highlighted = false));

    const hit = orbitalHitTest(this.particles, mx, my, 20);
    if (hit) hit.highlighted = true;
    return hit;
  }

  // ── Queries ──────────────────────────────────────────────────────
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
}

// ── Singleton global ─────────────────────────────────────────────────
export const orbitalSystem = new OrbitalSystem();

// ── Dados fixos de exemplo (substituir pelos dados reais depois) ─────
export const INITIAL_ORBITAL_PAYLOADS: OrbitalPayload[] = [
  {
    type: 'agenda',
    label: 'Treino HIIT',
    done: false,
    priority: 1,
    dueAt: Date.now() + 3_600_000,
  },
  {
    type: 'financas',
    label: 'Aporte mensal',
    value: 500.00,
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
  {
    type: 'agenda',
    label: 'Revisão portfólio',
    done: false,
    priority: 1,
    dueAt: Date.now() + 7_200_000,
  },
  {
    type: 'financas',
    label: 'Verificar BTC',
    value: 0,
    priority: 2,
  },
];
