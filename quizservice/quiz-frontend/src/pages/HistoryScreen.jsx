import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getMyAttempts } from '../api/quizApi'
import { formatTime } from '../hooks/useCountdown'

export default function HistoryScreen({ onBack }) {
  const [attempts, setAttempts] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMyAttempts()
      .then(setAttempts)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="relative min-h-screen grain">
      <div className="relative z-10 max-w-3xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between border-b border-ink-900/20 pb-6 mb-12">
          <button
            onClick={onBack}
            className="font-mono text-xs tracking-widest uppercase text-ink-900/60 hover:text-ink-900"
          >
            ← back
          </button>
          <div className="font-display italic text-xl">History</div>
          <span />
        </div>

        <div className="font-mono text-xs tracking-[0.3em] uppercase text-coral-accent mb-4">
          Your past attempts
        </div>
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight mb-12">
          The <em className="italic text-coral-accent">record.</em>
        </h1>

        {error && (
          <div className="p-4 border-l-4 border-coral-accent bg-coral-accent/10 font-mono text-sm text-coral-accent">
            Could not load history: {error}
          </div>
        )}

        {!error && attempts === null && (
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-mono text-sm tracking-widest uppercase text-ink-900/60 text-center py-12"
          >
            Loading…
          </motion.div>
        )}

        {attempts !== null && attempts.length === 0 && (
          <div className="py-12 text-center text-ink-900/50">
            No attempts yet. Go take a quiz.
          </div>
        )}

        {attempts !== null && attempts.length > 0 && (
          <div className="divide-y divide-ink-900/10 border-y border-ink-900/10">
            {attempts.map((a, i) => {
              const pct = Math.round((a.score / a.total) * 100)
              const color =
                pct >= 80 ? 'text-amber-accent'
                : pct >= 60 ? 'text-ink-900'
                : 'text-coral-accent'
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="py-6 px-2 flex items-baseline gap-6"
                >
                  <span className="font-mono text-xs text-ink-900/40 w-8">
                    №{String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm text-ink-900/80">
                      Quiz #{a.quizId}
                    </div>
                    <div className="font-mono text-xs text-ink-900/50 mt-1">
                      {new Date(a.attemptedAt).toLocaleString()}
                      {a.timeTakenSeconds != null && (
                        <span>  ·  {formatTime(a.timeTakenSeconds)} taken</span>
                      )}
                    </div>
                  </div>
                  <div className={`font-display text-3xl ${color}`}>
                    {pct}%
                  </div>
                  <div className="font-mono text-xs text-ink-900/50 w-16 text-right">
                    {a.score}/{a.total}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}