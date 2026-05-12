import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion'
import { formatTime } from '../hooks/useCountdown'

function AnimatedNumber({ value, duration = 1.5 }) {
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) => Math.round(v))
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const c = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] })
    const unsub = rounded.on('change', setDisplay)
    return () => { c.stop(); unsub() }
  }, [value, duration])
  return <span className="tabular">{display}</span>
}

export default function ResultsScreen({ result, onRetry, onHome }) {
  const [expanded, setExpanded] = useState(null)

  const percentage = Math.round((result.score / result.total) * 100)
  const verdict =
    percentage >= 80 ? 'Exceptional' :
    percentage >= 60 ? 'Well done' :
    percentage >= 40 ? 'Room to grow' :
    'Back to the books'

  const verdictColor =
    percentage >= 80 ? 'text-amber-accent' :
    percentage >= 60 ? 'text-ink-900' :
    'text-coral-accent'

  const breakdown = result.breakdown || []

  return (
    <div className="relative min-h-screen grain overflow-hidden">
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--amber), transparent 60%)' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-baseline border-b border-ink-900/20 pb-4 mb-16"
        >
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-ink-900/60">
            Results
          </div>
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-ink-900/60">
            {formatTime(result.timeTakenSeconds)} elapsed
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`font-display italic text-2xl mb-4 ${verdictColor}`}
        >
          {verdict}.
        </motion.div>

        <div className="flex items-baseline gap-6 flex-wrap mb-20">
          <div className="font-display text-[10rem] md:text-[14rem] leading-[0.85] tracking-tighter">
            <AnimatedNumber value={percentage} />
            <span className="text-coral-accent">%</span>
          </div>
          <div className="font-mono text-sm text-ink-900/60 space-y-1 pb-4">
            <div>
              <AnimatedNumber value={result.score} duration={1.2} /> of {result.total} correct
            </div>
            <div className="w-32 h-[2px] bg-ink-900/10 overflow-hidden">
              <motion.div
                className="h-full bg-ink-900"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>

        {breakdown.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display text-2xl">Your answers, reviewed</h2>
              <div className="font-mono text-xs tracking-widest uppercase text-ink-900/50">
                tap to expand
              </div>
            </div>

            <div className="divide-y divide-ink-900/10 border-y border-ink-900/10">
              {breakdown.map((item, i) => {
                const isOpen = expanded === item.questionId
                return (
                  <motion.div
                    key={item.questionId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.7 + i * 0.06 }}
                  >
                    <button
                      onClick={() => setExpanded(isOpen ? null : item.questionId)}
                      className="w-full text-left py-5 px-2 flex items-start gap-5 hover:bg-ink-900/[0.02] transition-colors"
                    >
                      <span className="font-mono text-xs text-ink-900/40 pt-1 w-8">
                        №{String(i + 1).padStart(2, '0')}
                      </span>

                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                          item.correct ? 'bg-amber-accent' : 'bg-coral-accent'
                        }`}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="text-base mb-1">{item.questionText}</div>
                        <div className="font-mono text-xs text-ink-900/50">
                          {item.correct ? 'Correct' : 'Incorrect'}
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        className="font-display text-xl text-ink-900/40"
                      >
                        ↓
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pl-16 pr-4 space-y-3 text-sm">
                            <div>
                              <span className="font-mono text-[10px] tracking-widest uppercase text-ink-900/50">
                                Your answer:
                              </span>
                              <div className={item.correct ? 'text-ink-900' : 'text-coral-accent'}>
                                {item.userAnswer || '(no answer)'}
                              </div>
                            </div>
                            {!item.correct && (
                              <div>
                                <span className="font-mono text-[10px] tracking-widest uppercase text-ink-900/50">
                                  Correct answer:
                                </span>
                                <div className="text-amber-accent">
                                  {item.correctAnswer}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-16 flex gap-4 flex-wrap"
        >
          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-ink-900 text-ink-50 font-display text-lg hover:bg-coral-accent transition-colors"
          >
            Try again  ↻
          </motion.button>
          <motion.button
            onClick={onHome}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 border border-ink-900 font-display text-lg hover:bg-ink-900 hover:text-ink-50 transition-colors"
          >
            Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}