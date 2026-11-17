'use client';

import { memo, useEffect, useMemo, useState } from 'react';

/*
 * A transformer-style self-attention view of the hero tagline (in the spirit
 * of BertViz's "head view"): every token on the left attends to tokens on the
 * right; curve strength = attention weight. Three hand-written "heads" show
 * different patterns. The weights are illustrative, not from a real model.
 *
 * It cycles the focused token while on screen, follows the pointer on hover,
 * and is static under reduced motion.
 */

const TOKENS = ['I', 'build', 'intelligent', 'systems', 'where', 'machine', 'learning', 'meets', 'practical', 'engineering'] as const;
const N = TOKENS.length;

type Pair = readonly [from: number, to: number, weight: number];

const HEADS: readonly { name: string; pairs: readonly Pair[] }[] = [
  {
    name: 'Syntax',
    pairs: [
      [0, 1, 0.8], [1, 3, 0.7], [1, 0, 0.3], [2, 3, 0.85], [3, 1, 0.7], [3, 2, 0.4], [4, 3, 0.6], [4, 7, 0.4],
      [5, 6, 0.8], [6, 7, 0.6], [6, 5, 0.4], [7, 6, 0.6], [7, 9, 0.5], [8, 9, 0.85], [9, 7, 0.6], [9, 8, 0.3],
    ],
  },
  {
    name: 'Meaning',
    pairs: [
      [0, 0, 0.6], [0, 1, 0.3], [1, 9, 0.6], [1, 3, 0.4], [2, 5, 0.6], [2, 6, 0.6], [3, 9, 0.7], [3, 1, 0.3],
      [4, 7, 0.5], [5, 6, 0.8], [5, 2, 0.4], [6, 2, 0.7], [6, 5, 0.5], [7, 4, 0.4], [7, 6, 0.4], [8, 9, 0.7],
      [8, 1, 0.4], [9, 3, 0.6], [9, 8, 0.6],
    ],
  },
  {
    name: 'Position',
    pairs: Array.from({ length: N }, (_, i) => [
      [i, Math.max(0, i - 1), 0.75],
      [i, i, 0.35],
      [i, Math.min(N - 1, i + 1), 0.15],
    ] as Pair[]).flat(),
  },
];

/** Row-normalised attention matrix (each row sums to 1, like a softmax). */
function buildMatrix(pairs: readonly Pair[]) {
  const m = Array.from({ length: N }, () => Array<number>(N).fill(0.02));
  for (const [i, j, w] of pairs) m[i]![j]! += w;
  return m.map((row) => {
    const sum = row.reduce((a, b) => a + b, 0);
    return row.map((v) => v / sum);
  });
}

const CYCLE_MS = 1900;
const y = (i: number) => ((i + 0.5) / N) * 100;

function AttentionMapInner({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const [head, setHead] = useState(0);
  const [focus, setFocus] = useState(2); // "intelligent"
  const [hovering, setHovering] = useState(false);
  const matrices = useMemo(() => HEADS.map((h) => buildMatrix(h.pairs)), []);
  const weights = matrices[head]![focus]!;

  // Auto-cycle the focused token while visible and not being explored.
  useEffect(() => {
    if (reducedMotion || !active || hovering) return undefined;
    const id = window.setInterval(() => {
      if (!document.hidden) setFocus((f) => (f + 1) % N);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, active, hovering]);

  return (
    <figure
      className="relative flex aspect-[0.92] w-full flex-col border border-[var(--line)] bg-[var(--surface)]"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <figcaption className="relative flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-3.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Self-attention</span>
        <span className="flex gap-1" role="group" aria-label="Attention head">
          {HEADS.map((h, i) => (
            <button
              key={h.name}
              type="button"
              aria-pressed={head === i}
              onClick={() => setHead(i)}
              className={`px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-text)] ${
                head === i
                  ? 'bg-[var(--primary)] text-[var(--ink)]'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {h.name}
            </button>
          ))}
        </span>
      </figcaption>

      <div className="relative flex-1 px-5 py-6">
        <div className="relative h-full">
          {/* Curves: from the focused token (left) to every token (right). */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Faint full pattern of the head, for texture. */}
            {matrices[head]!.map((row, i) =>
              row.map((w, j) =>
                w > 0.12 ? (
                  <path
                    key={`bg-${i}-${j}`}
                    d={`M33 ${y(i)} C50 ${y(i)} 50 ${y(j)} 67 ${y(j)}`}
                    fill="none"
                    stroke="var(--line-strong)"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                    opacity={0.5}
                  />
                ) : null,
              ),
            )}
            {weights.map((w, j) => (
              <path
                key={`f-${j}`}
                d={`M33 ${y(focus)} C50 ${y(focus)} 50 ${y(j)} 67 ${y(j)}`}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={1 + w * 7}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="transition-[stroke-opacity,stroke-width] duration-300 ease-out"
                strokeOpacity={Math.min(1, w * 2.2)}
              />
            ))}
          </svg>

          {/* Query tokens (left) */}
          <ol className="absolute inset-y-0 left-0 flex w-[33%] flex-col justify-around pr-3 text-right" aria-label="Tokens">
            {TOKENS.map((t, i) => (
              <li key={`q-${t}`}>
                <button
                  type="button"
                  onPointerEnter={() => setFocus(i)}
                  onFocus={() => setFocus(i)}
                  onClick={() => setFocus(i)}
                  aria-pressed={focus === i}
                  className={`px-1.5 py-0.5 font-mono text-[12px] leading-5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-text)] ${
                    focus === i ? 'bg-[var(--primary)] text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {t}
                </button>
              </li>
            ))}
          </ol>

          {/* Key tokens (right) — brightness follows the weight. */}
          <ol className="absolute inset-y-0 right-0 flex w-[33%] flex-col justify-around pl-3" aria-hidden="true">
            {TOKENS.map((t, j) => {
              const w = weights[j]!;
              return (
                <li key={`k-${t}`} className="font-mono text-[12px] leading-5">
                  <span
                    className="px-1.5 py-0.5 transition-[color,background-color] duration-300"
                    style={{
                      color: w > 0.2 ? 'var(--foreground)' : 'var(--muted)',
                      backgroundColor: `rgb(var(--primary-rgb) / ${Math.min(0.45, w * 0.9).toFixed(3)})`,
                    }}
                  >
                    {t}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <p className="relative border-t border-[var(--line)] px-5 py-3 font-mono text-[11px] text-[var(--muted)]">
        <span className="text-[var(--foreground)]">{TOKENS[focus]}</span> attends most to{' '}
        <span className="text-[var(--primary-text)]">
          {TOKENS[weights.indexOf(Math.max(...weights))]}
        </span>
        <span className="hidden sm:inline"> · hover a word · illustrative weights</span>
      </p>
    </figure>
  );
}

const AttentionMap = memo(AttentionMapInner);
export default AttentionMap;
