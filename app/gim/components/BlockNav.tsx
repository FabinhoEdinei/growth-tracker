'use client';
// app/gim/components/BlockNav.tsx
// Navegação horizontal de blocos do treino (scroll)

import React from 'react';
import { T } from './theme';

interface Block {
  id:          string;
  name:        string;
  exercises:   { id: string }[];
  description?: string;
}

interface Props {
  blocks:               Block[];
  currentBlockIndex:    number;
  currentExerciseIndex: number;
}

export function BlockNav({ blocks, currentBlockIndex, currentExerciseIndex }: Props) {
  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      {/* Scroll de blocos */}
      <div style={{ overflowX: 'auto', display: 'flex' }}>
        {blocks.map((block, i) => {
          const isActive    = i === currentBlockIndex;
          const isCompleted = i < currentBlockIndex;

          return (
            <div
              key={block.id}
              style={{
                minWidth: 160, padding: '10px 14px',
                borderRight: `1px solid ${T.border}`,
                background: isActive ? 'rgba(255,69,32,0.06)' : 'transparent',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {/* Indicador ativo */}
              {isActive && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: 2, background: T.gradient,
                }}/>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                {/* Badge letra */}
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: isCompleted ? T.success
                    : isActive ? T.gradient
                    : T.card,
                  border: `1px solid ${isActive ? 'transparent' : T.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 900, color: '#fff',
                  fontFamily: T.mono,
                }}>
                  {isCompleted ? '✓' : String.fromCharCode(65 + i)}
                </div>

                <div style={{
                  fontSize: 10, fontWeight: 800,
                  color: isActive ? T.text : T.muted,
                  letterSpacing: 0.5,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  maxWidth: 110,
                }}>
                  {block.name}
                </div>
              </div>

              <div style={{ fontSize: 9, color: T.faint, fontFamily: T.mono }}>
                {isActive
                  ? `${currentExerciseIndex + 1}/${block.exercises.length} exercícios`
                  : `${block.exercises.length} exercícios`
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
