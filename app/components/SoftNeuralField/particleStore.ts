// particleStore.ts
// Armazém central leve de dados das partículas
// Separa dados do canvas → fácil manutenção

import { ParticleMemory, ParticlePayload, DataType, createParticleMemory } from './particleData';
import { recordPosition, getProsperityScore } from './trajectoryMath';

type MemoryMap = Map<string, ParticleMemory>;

export class ParticleStore {
  private store: MemoryMap = new Map();

  // Registra nova partícula com dados opcionais
  register(
    id: string,
    type: DataType = 'vazio',
    payload?: Partial<ParticlePayload>
  ): void {
    this.store.set(id, createParticleMemory(type, payload));
  }

  // Atualiza posição a cada frame
  tick(
    id: string,
    x: number, y: number,
    vx: number, vy: number,
    zone: string
  ): void {
    const mem = this.store.get(id);
    if (!mem) return;

    recordPosition(mem, x, y, vx, vy);
    mem.zonesVisited.add(zone);
  }

  // Registra colisão
  onCollision(id: string): void {
    const mem = this.store.get(id);
    if (mem) mem.collisions++;
  }

  // Atualiza payload (adicionar dados de agenda/financas etc)
  updatePayload(id: string, patch: Partial<ParticlePayload>): void {
    const mem = this.store.get(id);
    if (mem) mem.payload = { ...mem.payload, ...patch };
  }

  // Lê memória completa
  get(id: string): ParticleMemory | undefined {
    return this.store.get(id);
  }

  // Score de prosperidade rápido
  score(id: string): number {
    const mem = this.store.get(id);
    return mem ? getProsperityScore(mem) : 0;
  }

  // Busca partículas por tipo de dado
  findByType(type: DataType): ParticleMemory[] {
    return Array.from(this.store.values())
      .filter(m => m.payload.type === type);
  }

  // Busca partículas com payload vencendo em breve (ms)
  findDueSoon(windowMs: number = 3_600_000): ParticleMemory[] {
    const now = Date.now();
    return Array.from(this.store.values()).filter(m => {
      if (!m.payload.dueAt) return false;
      const diff = m.payload.dueAt - now;
      return diff > 0 && diff <= windowMs;
    });
  }

  // Remove partícula morta
  remove(id: string): void {
    this.store.delete(id);
  }

  // Estatísticas gerais
  stats() {
    const all = Array.from(this.store.values());
    return {
      total: all.length,
      porTipo: {
        agenda:   all.filter(m => m.payload.type === 'agenda').length,
        financas: all.filter(m => m.payload.type === 'financas').length,
        saude:    all.filter(m => m.payload.type === 'saude').length,
        meta:     all.filter(m => m.payload.type === 'meta').length,
        vazio:    all.filter(m => m.payload.type === 'vazio').length,
      },
      mediaScore: all.reduce((s, m) => s + getProsperityScore(m), 0) / (all.length || 1),
    };
  }
}

// Singleton — uma instância para todo o app
export const particleStore = new ParticleStore();
