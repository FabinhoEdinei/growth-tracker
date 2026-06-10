"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ══════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════
interface CardData {
  id: number;
  emoji: string;
  pt: string;
  es: string;
  en: string;
  cat: string;
}

interface DeckCard extends CardData {
  cardId: string;
  lang: "pt" | "es" | "en";
  matchId: number;
}

interface Level {
  id: number;
  name: string;
  nameEs: string;
  nameEn: string;
  pairs: number;
  timeLimit: number;
  color: string;
  glowColor: string;
  stars: number;
}

// ══════════════════════════════════════════════
// CARD DATABASE — Trios: emoji + PT + ES + EN
// ══════════════════════════════════════════════
const CARD_DB: CardData[] = [
  // COISAS / OBJETOS
  { id: 1,  emoji: "🍎", pt: "Maçã",             es: "Manzana",        en: "Apple",        cat: "fruit"    },
  { id: 2,  emoji: "🐉", pt: "Dragão",            es: "Dragón",         en: "Dragon",       cat: "creature" },
  { id: 3,  emoji: "⚔️", pt: "Espada",            es: "Espada",         en: "Sword",        cat: "item"     },
  { id: 4,  emoji: "🌙", pt: "Lua",               es: "Luna",           en: "Moon",         cat: "nature"   },
  { id: 5,  emoji: "🔥", pt: "Fogo",              es: "Fuego",          en: "Fire",         cat: "element"  },
  { id: 6,  emoji: "💎", pt: "Diamante",          es: "Diamante",       en: "Diamond",      cat: "item"     },
  { id: 7,  emoji: "🏰", pt: "Castelo",           es: "Castillo",       en: "Castle",       cat: "place"    },
  { id: 8,  emoji: "🦊", pt: "Raposa",            es: "Zorro",          en: "Fox",          cat: "animal"   },
  { id: 9,  emoji: "🌊", pt: "Onda",              es: "Ola",            en: "Wave",         cat: "nature"   },
  { id: 10, emoji: "🎯", pt: "Alvo",              es: "Objetivo",       en: "Target",       cat: "item"     },
  { id: 11, emoji: "🌸", pt: "Flor de Cerejeira", es: "Flor de Cerezo", en: "Cherry Blossom", cat: "nature" },
  { id: 12, emoji: "🎮", pt: "Videogame",         es: "Videojuego",     en: "Video Game",   cat: "item"     },
  // AÇÕES
  { id: 13, emoji: "🏃", pt: "Correr",  es: "Correr",  en: "Run",   cat: "action" },
  { id: 14, emoji: "💤", pt: "Dormir",  es: "Dormir",  en: "Sleep", cat: "action" },
  { id: 15, emoji: "🎵", pt: "Cantar",  es: "Cantar",  en: "Sing",  cat: "action" },
  { id: 16, emoji: "📖", pt: "Ler",     es: "Leer",    en: "Read",  cat: "action" },
  { id: 17, emoji: "🍳", pt: "Cozinhar",es: "Cocinar", en: "Cook",  cat: "action" },
  { id: 18, emoji: "✈️", pt: "Voar",    es: "Volar",   en: "Fly",   cat: "action" },
  { id: 19, emoji: "💃", pt: "Dançar",  es: "Bailar",  en: "Dance", cat: "action" },
  { id: 20, emoji: "🤝", pt: "Ajudar",  es: "Ayudar",  en: "Help",  cat: "action" },
  // LUGARES
  { id: 21, emoji: "🏔️", pt: "Montanha", es: "Montaña", en: "Mountain", cat: "place" },
  { id: 22, emoji: "🌋", pt: "Vulcão",   es: "Volcán",  en: "Volcano",  cat: "place" },
  { id: 23, emoji: "🏖️", pt: "Praia",    es: "Playa",   en: "Beach",    cat: "place" },
  { id: 24, emoji: "🌆", pt: "Cidade",   es: "Ciudad",  en: "City",     cat: "place" },
  // ELEMENTOS
  { id: 25, emoji: "⚡",  pt: "Relâmpago", es: "Rayo",    en: "Lightning", cat: "element" },
  { id: 26, emoji: "❄️",  pt: "Neve",      es: "Nieve",   en: "Snow",      cat: "element" },
  { id: 27, emoji: "🌪️", pt: "Tornado",   es: "Tornado", en: "Tornado",   cat: "element" },
  { id: 28, emoji: "🌈", pt: "Arco-íris", es: "Arcoíris",en: "Rainbow",   cat: "nature"  },
  // CRIATURAS
  { id: 29, emoji: "🐺", pt: "Lobo", es: "Lobo", en: "Wolf", cat: "animal" },
  { id: 30, emoji: "🦁", pt: "Leão", es: "León", en: "Lion", cat: "animal" },
];

// ══════════════════════════════════════════════
// LEVEL CONFIG
// ══════════════════════════════════════════════
const LEVELS: Level[] = [
  { id: 1, name: "Aprendiz",  nameEs: "Aprendiz", nameEn: "Apprentice", pairs: 4,  timeLimit: 120, color: "#00ff88", glowColor: "#00ff8855", stars: 1 },
  { id: 2, name: "Guerreiro", nameEs: "Guerrero", nameEn: "Warrior",    pairs: 6,  timeLimit: 100, color: "#00ccff", glowColor: "#00ccff55", stars: 2 },
  { id: 3, name: "Mestre",    nameEs: "Maestro",  nameEn: "Master",     pairs: 8,  timeLimit: 80,  color: "#ff00ff", glowColor: "#ff00ff55", stars: 3 },
  { id: 4, name: "Lenda",     nameEs: "Leyenda",  nameEn: "Legend",     pairs: 10, timeLimit: 60,  color: "#ff9900", glowColor: "#ff990055", stars: 4 },
  { id: 5, name: "Deus",      nameEs: "Dios",     nameEn: "God",        pairs: 12, timeLimit: 45,  color: "#ff0044", glowColor: "#ff004455", stars: 5 },
];

// ══════════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════════
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(pairs: number): DeckCard[] {
  const selected = shuffle(CARD_DB).slice(0, pairs);
  const deck: DeckCard[] = [];
  selected.forEach((card) => {
    deck.push({ ...card, cardId: `${card.id}-pt`, lang: "pt", matchId: card.id });
    deck.push({ ...card, cardId: `${card.id}-es`, lang: "es", matchId: card.id });
    deck.push({ ...card, cardId: `${card.id}-en`, lang: "en", matchId: card.id });
  });
  return shuffle(deck);
}

// ══════════════════════════════════════════════
// CARD COMPONENT
// ══════════════════════════════════════════════
interface Card3DProps {
  card: DeckCard;
  isFlipped: boolean;
  isMatched: boolean;
  isWrong: boolean;
  onClick: (card: DeckCard) => void;
  delay?: number;
}

function Card3D({ card, isFlipped, isMatched, isWrong, onClick, delay = 0 }: Card3DProps) {
  // BUG FIX: tilt vai no wrapper externo (perspective container),
  // NÃO na face frontal — senão o backfaceVisibility quebra e a
  // carta fica visível dos dois lados ao mesmo tempo.
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isFlipped || isMatched || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 8, y: dx * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const langColors: Record<string, string> = { pt: "#00ff88", es: "#ff9900", en: "#00ccff" };
  const langLabels: Record<string, string> = { pt: "PT", es: "ES", en: "EN" };
  const langColor = langColors[card.lang];

  const wordMap: Record<string, string> = { pt: card.pt, es: card.es, en: card.en };
  const word = wordMap[card.lang];

  // Transform correto: quando virado, aplica rotateY(180deg) + tilt no wrapper.
  // As faces usam apenas backfaceVisibility e rotateY(180deg) estático — sem tilt próprio.
  const wrapperTransform = isFlipped
    ? `rotateY(180deg) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
    : `rotateY(0deg)`;

  return (
    <div
      ref={cardRef}
      onClick={() => !isMatched && onClick(card)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "600px",
        width: "90px",
        height: "120px",
        cursor: isMatched ? "default" : "pointer",
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: wrapperTransform,
          transition: "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          filter: isMatched
            ? `drop-shadow(0 0 12px ${langColor}) brightness(1.2)`
            : isWrong
            ? "drop-shadow(0 0 12px #ff0044)"
            : "none",
        }}
      >
        {/* BACK */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #0a0f1e 0%, #111830 50%, #0d1425 100%)",
            border: "1px solid #1e3a5f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", inset: 0,
            background: "repeating-linear-gradient(45deg, #00ccff22 0px, transparent 2px, transparent 20px, #00ccff22 22px)",
            opacity: 0.15,
          }} />
          <div style={{
            width: "40px", height: "40px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #0066ff33, #00ffcc33)",
            border: "1px solid #00ccff44",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px",
            position: "relative",
          }}>🌐</div>
        </div>

        {/* FRONT — transform estático rotateY(180deg) apenas, sem tilt próprio */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "10px",
            background: isMatched
              ? `linear-gradient(135deg, ${langColor}22 0%, ${langColor}11 100%)`
              : "linear-gradient(135deg, #0d1a2e 0%, #0a1525 100%)",
            border: `1px solid ${isMatched ? langColor : langColor + "66"}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "8px 4px",
            boxShadow: `0 0 ${isMatched ? 20 : 8}px ${langColor}33`,
            overflow: "hidden",
          }}
        >
          {/* Lang badge */}
          <div style={{
            position: "absolute", top: "5px", right: "5px",
            fontSize: "8px", fontFamily: "'Courier New', monospace",
            color: langColor, fontWeight: "bold",
            background: `${langColor}22`,
            padding: "1px 4px", borderRadius: "3px",
            border: `1px solid ${langColor}44`,
          }}>{langLabels[card.lang]}</div>

          {/* Emoji */}
          <div style={{ fontSize: "30px", lineHeight: "1", filter: isMatched ? "none" : "saturate(0.8)" }}>
            {card.emoji}
          </div>

          {/* Word */}
          <div style={{
            fontSize: word.length > 9 ? "9px" : word.length > 6 ? "11px" : "13px",
            fontFamily: "'Courier New', monospace",
            color: isMatched ? langColor : "#e0e8ff",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: "1.2",
            textShadow: isMatched ? `0 0 8px ${langColor}` : "none",
            padding: "0 4px",
          }}>{word}</div>

          {/* Matched check */}
          {isMatched && (
            <div style={{ fontSize: "14px", color: langColor, textShadow: `0 0 10px ${langColor}` }}>✓</div>
          )}

          {/* Scanline */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "10px",
            background: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)",
            pointerEvents: "none",
          }} />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// LEVEL SELECT SCREEN
// ══════════════════════════════════════════════
interface LevelSelectProps {
  onSelect: (lvl: Level) => void;
  scores: Record<number, number>;
}

function LevelSelect({ onSelect, scores }: LevelSelectProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050b18",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Courier New', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* BG Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(#00ccff08 1px, transparent 1px), linear-gradient(90deg, #00ccff08 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "40px", position: "relative" }}>
        <div style={{ fontSize: "11px", letterSpacing: "6px", color: "#00ccff99", marginBottom: "8px", textTransform: "uppercase" }}>
          ▸ Lingua Trio ◂
        </div>
        <h1 style={{
          fontSize: "clamp(28px, 6vw, 48px)",
          fontWeight: "900",
          margin: 0,
          background: "linear-gradient(90deg, #00ff88, #00ccff, #ff00ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-1px",
        }}>CARD GAME</h1>
        <p style={{ color: "#4a6080", fontSize: "12px", marginTop: "8px", letterSpacing: "3px" }}>
          🇧🇷 PT · 🇪🇸 ES · 🇺🇸 EN
        </p>
      </div>

      {/* Levels */}
      <div style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        justifyContent: "center",
        maxWidth: "600px",
      }}>
        {LEVELS.map((lvl, i) => {
          const best = scores[lvl.id];
          const isHov = hovered === lvl.id;
          return (
            <div
              key={lvl.id}
              onClick={() => onSelect(lvl)}
              onMouseEnter={() => setHovered(lvl.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: "100px",
                padding: "16px 10px",
                borderRadius: "12px",
                background: isHov
                  ? `linear-gradient(135deg, ${lvl.glowColor}, ${lvl.color}22)`
                  : "linear-gradient(135deg, #0a1525, #0d1a2e)",
                border: `1px solid ${isHov ? lvl.color : lvl.color + "44"}`,
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
                boxShadow: isHov
                  ? `0 0 24px ${lvl.glowColor}, 0 0 48px ${lvl.glowColor}`
                  : `0 0 8px ${lvl.glowColor}`,
                transform: isHov ? "translateY(-6px) scale(1.05)" : "none",
                animationDelay: `${i * 100}ms`,
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                {"⭐".repeat(lvl.stars)}
              </div>
              <div style={{
                fontSize: "11px", fontWeight: "bold", color: lvl.color,
                marginBottom: "2px", letterSpacing: "1px",
              }}>{lvl.name}</div>
              <div style={{ fontSize: "9px", color: "#4a6080", marginBottom: "6px" }}>
                {lvl.nameEs} / {lvl.nameEn}
              </div>
              <div style={{
                fontSize: "9px", color: "#2a4060",
                borderTop: `1px solid ${lvl.color}22`,
                paddingTop: "4px",
              }}>
                {lvl.pairs * 3} cartas · {lvl.timeLimit}s
              </div>
              {best !== undefined && (
                <div style={{ fontSize: "9px", color: lvl.color, marginTop: "4px" }}>
                  ✓ {best}pts
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p style={{
        color: "#1e3a5f", fontSize: "11px", marginTop: "32px",
        textAlign: "center", maxWidth: "300px", lineHeight: "1.6",
      }}>
        Monte trios de cartas com a mesma palavra em 3 idiomas.<br />
        Emoji + ação + objeto em cada fase.
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════
// GAME SCREEN
// ══════════════════════════════════════════════
interface GameScreenProps {
  level: Level;
  onBack: () => void;
  onWin: (score: number) => void;
  onLose: (score: number) => void;
}

function GameScreen({ level, onBack, onWin, onLose }: GameScreenProps) {
  const [deck, setDeck] = useState<DeckCard[]>([]);
  const [flipped, setFlipped] = useState<DeckCard[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(level.timeLimit);
  const [moves, setMoves] = useState(0);
  const [combo, setCombo] = useState(0);
  const [shake, setShake] = useState(false);
  const [dealAnim, setDealAnim] = useState(false);
  const [lastMatch, setLastMatch] = useState<{ pts: number; combo: number } | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);

  // BUG FIX: refs para callbacks estáveis nos efeitos
  const onWinRef = useRef(onWin);
  const onLoseRef = useRef(onLose);
  useEffect(() => { onWinRef.current = onWin; }, [onWin]);
  useEffect(() => { onLoseRef.current = onLose; }, [onLose]);

  const scoreRef = useRef(score);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const matchedRef = useRef(matched);
  useEffect(() => { matchedRef.current = matched; }, [matched]);

  const timeLeftRef = useRef(timeLeft);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  // Init deck + timer
  useEffect(() => {
    const d = buildDeck(level.pairs);
    setDeck(d);
    setDealAnim(true);
    const animTimer = setTimeout(() => setDealAnim(false), 800);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current!);
      clearTimeout(animTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Time out → lose
  useEffect(() => {
    if (timeLeft === 0 && matchedRef.current.size < level.pairs) {
      onLoseRef.current(scoreRef.current);
    }
  }, [timeLeft, level.pairs]);

  // Win check
  useEffect(() => {
    if (deck.length > 0 && matched.size === level.pairs) {
      clearInterval(timerRef.current!);
      const bonus = timeLeftRef.current * 5;
      const total = scoreRef.current + bonus;
      const t = setTimeout(() => onWinRef.current(total), 800);
      return () => clearTimeout(t);
    }
  }, [matched, deck.length, level.pairs]);

  const handleFlip = useCallback((card: DeckCard) => {
    if (lockRef.current) return;
    if (flipped.find((c) => c.cardId === card.cardId)) return;
    if (matched.has(card.matchId)) return;

    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);

    if (newFlipped.length === 3) {
      lockRef.current = true;
      setMoves((m) => m + 1);
      const allSame = newFlipped.every((c) => c.matchId === newFlipped[0].matchId);
      if (allSame) {
        setCombo((prev) => {
          const newCombo = prev + 1;
          const pts = 100 + newCombo * 50;
          setScore((s) => s + pts);
          setLastMatch({ pts, combo: newCombo });
          setTimeout(() => setLastMatch(null), 1200);
          return newCombo;
        });
        setTimeout(() => {
          setMatched((m) => new Set([...m, newFlipped[0].matchId]));
          setFlipped([]);
          lockRef.current = false;
        }, 600);
      } else {
        setCombo(0);
        setWrong(newFlipped.map((c) => c.cardId));
        setShake(true);
        setTimeout(() => {
          setFlipped([]);
          setWrong([]);
          setShake(false);
          lockRef.current = false;
        }, 900);
      }
    }
  }, [flipped, matched]);

  const timerPct = (timeLeft / level.timeLimit) * 100;
  const timerColor = timerPct > 50 ? level.color : timerPct > 25 ? "#ff9900" : "#ff0044";
  const matchedCount = matched.size;
  const totalPairs = level.pairs;

  // Suppress unused warning
  void moves;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050b18",
      fontFamily: "'Courier New', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* BG */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "linear-gradient(#00ccff06 1px, transparent 1px), linear-gradient(90deg, #00ccff06 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* HUD */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center",
        padding: "12px 16px", gap: "12px",
        background: "linear-gradient(180deg, #0a0f1e, transparent)",
        borderBottom: "1px solid #1e3a5f",
        flexWrap: "wrap",
      }}>
        <button
          onClick={onBack}
          style={{
            background: "transparent", border: "1px solid #1e3a5f",
            color: "#4a6080", padding: "4px 10px", borderRadius: "6px",
            cursor: "pointer", fontSize: "11px", fontFamily: "inherit",
          }}
        >← Voltar</button>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "9px", color: "#4a6080", letterSpacing: "2px" }}>
            NÍVEL {level.id} — {level.name.toUpperCase()}
          </div>
          <div style={{
            height: "4px", background: "#0a1525", borderRadius: "2px", marginTop: "4px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, height: "100%",
              width: `${timerPct}%`,
              background: `linear-gradient(90deg, ${timerColor}, ${timerColor}99)`,
              borderRadius: "2px",
              transition: "width 1s linear",
              boxShadow: `0 0 8px ${timerColor}`,
            }} />
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: "18px", fontWeight: "bold",
            color: timerColor, textShadow: `0 0 12px ${timerColor}`,
          }}>
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "9px", color: "#4a6080" }}>SCORE</div>
          <div style={{ fontSize: "16px", color: level.color, fontWeight: "bold" }}>{score}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "9px", color: "#4a6080" }}>TRIOS</div>
          <div style={{ fontSize: "16px", color: "#e0e8ff" }}>{matchedCount}/{totalPairs}</div>
        </div>

        {combo > 1 && (
          <div style={{
            background: `${level.color}22`, border: `1px solid ${level.color}`,
            borderRadius: "6px", padding: "4px 8px", fontSize: "11px",
            color: level.color, textShadow: `0 0 8px ${level.color}`,
            animation: "pulse 0.5s ease",
          }}>⚡ COMBO ×{combo}</div>
        )}
      </div>

      {/* Last match popup */}
      {lastMatch && (
        <div style={{
          position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)",
          background: `${level.color}22`, border: `1px solid ${level.color}`,
          borderRadius: "10px", padding: "8px 20px", zIndex: 100,
          color: level.color, fontSize: "16px", fontWeight: "bold",
          textShadow: `0 0 12px ${level.color}`,
          animation: "floatUp 1.2s ease forwards",
        }}>
          +{lastMatch.pts} {lastMatch.combo > 1 ? `⚡×${lastMatch.combo}` : "✓"}
        </div>
      )}

      {/* Lang indicators */}
      <div style={{
        display: "flex", justifyContent: "center", gap: "20px",
        padding: "8px", fontSize: "11px", color: "#2a4060",
        position: "relative", zIndex: 5,
      }}>
        <span style={{ color: "#00ff88" }}>🇧🇷 PT</span>
        <span>+</span>
        <span style={{ color: "#ff9900" }}>🇪🇸 ES</span>
        <span>+</span>
        <span style={{ color: "#00ccff" }}>🇺🇸 EN</span>
        <span style={{ color: "#4a6080" }}>= TRIO ✓</span>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          padding: "12px 16px 32px",
          position: "relative", zIndex: 5,
          animation: shake ? "shakeBoard 0.3s ease" : "none",
        }}
      >
        {deck.map((card, i) => {
          const isFlippedCard = !!flipped.find((c) => c.cardId === card.cardId) || matched.has(card.matchId);
          const isMatched = matched.has(card.matchId);
          const isWrong = wrong.includes(card.cardId);
          return (
            <div
              key={card.cardId}
              style={{
                animation: dealAnim ? "dealIn 0.4s ease both" : "none",
                animationDelay: `${i * 30}ms`,
                opacity: isMatched ? 0.5 : 1,
                transition: "opacity 0.5s ease",
              }}
            >
              <Card3D
                card={card}
                isFlipped={isFlippedCard}
                isMatched={isMatched}
                isWrong={isWrong}
                onClick={handleFlip}
                delay={i * 30}
              />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-40px); }
        }
        @keyframes dealIn {
          0%   { opacity: 0; transform: scale(0.5) translateY(-20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shakeBoard {
          0%,100% { transform: translateX(0); }
          25%     { transform: translateX(-6px); }
          75%     { transform: translateX(6px); }
        }
        @keyframes pulse {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════
// RESULT SCREEN
// ══════════════════════════════════════════════
interface ResultScreenProps {
  won: boolean;
  score: number;
  level: Level;
  onReplay: () => void;
  onBack: () => void;
}

function ResultScreen({ won, score, level, onReplay, onBack }: ResultScreenProps) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050b18",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Courier New', monospace",
      textAlign: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(ellipse at center, ${level.glowColor} 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{
        transform: show ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
        opacity: show ? 1 : 0,
        transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        position: "relative",
      }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>
          {won ? "🏆" : "💀"}
        </div>

        <h1 style={{
          fontSize: "clamp(24px, 6vw, 42px)",
          fontWeight: "900",
          margin: "0 0 8px",
          color: won ? level.color : "#ff0044",
          textShadow: `0 0 24px ${won ? level.color : "#ff0044"}`,
          letterSpacing: "-1px",
        }}>
          {won ? "VITÓRIA!" : "DERROTA"}
        </h1>

        <p style={{ color: "#4a6080", fontSize: "12px", letterSpacing: "3px", margin: "0 0 32px" }}>
          {won ? "VICTORY · VICTORIA" : "DEFEAT · DERROTA"}
        </p>

        {won && (
          <div style={{
            background: `${level.color}11`,
            border: `1px solid ${level.color}44`,
            borderRadius: "12px",
            padding: "20px 32px",
            marginBottom: "24px",
          }}>
            <div style={{ fontSize: "11px", color: "#4a6080", letterSpacing: "2px", marginBottom: "8px" }}>
              PONTUAÇÃO FINAL
            </div>
            <div style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: level.color,
              textShadow: `0 0 20px ${level.color}`,
            }}>{score}</div>
            <div style={{ fontSize: "12px", color: "#2a4060", marginTop: "4px" }}>
              {"⭐".repeat(level.stars)} Nível {level.name}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={onReplay}
            style={{
              background: `linear-gradient(135deg, ${level.color}33, ${level.color}11)`,
              border: `1px solid ${level.color}`,
              color: level.color,
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "inherit",
              fontWeight: "bold",
              letterSpacing: "1px",
              boxShadow: `0 0 16px ${level.glowColor}`,
              transition: "all 0.2s",
            }}
          >↺ Jogar Novamente</button>
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "1px solid #1e3a5f",
              color: "#4a6080",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "inherit",
              letterSpacing: "1px",
              transition: "all 0.2s",
            }}
          >☰ Níveis</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════
export default function LinguaTrioGame() {
  const [screen, setScreen] = useState<"levels" | "game" | "result">("levels");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [gameResult, setGameResult] = useState<{ won: boolean; score: number } | null>(null);
  const [scores, setScores] = useState<Record<number, number>>({});

  // BUG FIX: gameKey estável — só muda ao iniciar NOVO jogo,
  // nunca em re-renders. Antes usava Date.now() direto no JSX
  // o que causava remount em todo render e perda de estado.
  const [gameKey, setGameKey] = useState(0);

  const handleSelectLevel = (lvl: Level) => {
    setSelectedLevel(lvl);
    setGameKey((k) => k + 1); // nova key apenas ao selecionar nível
    setScreen("game");
  };

  const handleWin = (score: number) => {
    setScores((s) => ({
      ...s,
      [selectedLevel!.id]: Math.max(s[selectedLevel!.id] || 0, score),
    }));
    setGameResult({ won: true, score });
    setScreen("result");
  };

  const handleLose = (score: number) => {
    setGameResult({ won: false, score });
    setScreen("result");
  };

  const handleReplay = () => {
    setGameKey((k) => k + 1); // força remount limpo só aqui
    setGameResult(null);
    setScreen("game");
  };

  const handleBack = () => {
    setScreen("levels");
    setGameResult(null);
  };

  if (screen === "game" && selectedLevel) {
    return (
      <GameScreen
        key={gameKey}
        level={selectedLevel}
        onBack={handleBack}
        onWin={handleWin}
        onLose={handleLose}
      />
    );
  }

  if (screen === "result" && gameResult && selectedLevel) {
    return (
      <ResultScreen
        won={gameResult.won}
        score={gameResult.score}
        level={selectedLevel}
        onReplay={handleReplay}
        onBack={handleBack}
      />
    );
  }

  return <LevelSelect onSelect={handleSelectLevel} scores={scores} />;
}
