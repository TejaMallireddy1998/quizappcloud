import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getQuizQuestions, submitQuiz, normalizeQuestion } from '../api/quizApi'
import { useCountdown, formatTime } from '../hooks/useCountdown'

export default function QuizScreen({ quizId, duration, onComplete, onExit }) {
  const [questions, setQuestions] = useState(null)
  const [error, setError] = useState(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getQuizQuestions(quizId)
      .then((raw) => setQuestions(raw.map(normalizeQuestion)))
      .catch((e) => setError(e.message))
  }, [quizId])

  const handleExpire = () => {
    if (!submitting) submit(duration)
  }

  const { remaining, elapsed } = useCountdown(
    duration,
    !!questions && !submitting,
    handleExpire
  )

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center grain px-6">
        <div className="max-w-md text-center">
          <div className="font-display text-3xl text-coral-accent mb-4">Couldn't load quiz</div>
          <div className="font-mono text-sm text-ink-900/60 mb-6">{error}</div>
          <button onClick={onExit} className="px-6 py-3 bg-ink-900 text-ink-50 font-display">
            ← back
          </button>
        </div>
      </div>
    )
  }

  if (!questions) {
    return (
      <div className="min-h-screen flex items-center justify-center grain">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-mono text-sm tracking-widest uppercase text-ink-900/60"
        >
          Loading quiz…
        </motion.div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center grain px-6">
        <div className="max-w-md text-center">
          <div className="font-display text-3xl mb-4">No questions found.</div>
          <button onClick={onExit} className="px-6 py-3 bg-ink-900 text-ink-50 font-display">
            ← back
          </button>
        </div>
      </div>
    )
  }

  const question = questions[index]
  const selected = answers[question.id]
  const progress = ((index + 1) / questions.length) * 100
  const isLast = index === questions.length - 1
  const canProceed = !!selected
  const lowTime = remaining < 20

  const choose = (optText) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optText }))
  }

  const next = () => {
    if (isLast) submit(elapsed)
    else setIndex(index + 1)
  }

  const prev = () => index > 0 && setIndex(index - 1)

  const submit = async (timeTaken) => {
  setSubmitting(true)
  const payload = questions.map((q) => ({
    id: q.id,
    response: answers[q.id] || '',
  }))
  try {
    const result = await submitQuiz(quizId, payload, timeTaken)
    onComplete({
      score: result.score,
      total: result.total,
      breakdown: result.breakdown,
      timeTakenSeconds: timeTaken,
    })
  } catch (e) {
    setError(e.message)
    setSubmitting(false)
  }
}

  return (
    <div className="relative min-h-screen grain overflow-hidden flex flex-col">
      <div className="sticky top-0 z-20 backdrop-blur-sm bg-ink-50/80 border-b border-ink-900/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-6">
          <button
            onClick={onExit}
            className="font-mono text-xs tracking-widest uppercase text-ink-900/50 hover:text-ink-900"
          >
            ← exit
          </button>

          <div className="flex-1 flex items-center gap-3">
            <div className="font-mono text-xs tabular text-ink-900/60 w-12">
              {String(index + 1).padStart(2, '0')}/{String(questions.length).padStart(2, '0')}
            </div>
            <div className="flex-1 h-[2px] bg-ink-900/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-ink-900"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          <motion.div
            animate={lowTime ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 1, repeat: lowTime ? Infinity : 0 }}
            className={`font-mono text-sm tabular tracking-widest ${
              lowTime ? 'text-coral-accent' : 'text-ink-900'
            }`}
          >
            {formatTime(remaining)}
          </motion.div>
        </div>
      </div>

      <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col"
          >
            <div className="font-mono text-xs tracking-[0.25em] uppercase text-coral-accent mb-4">
              Question №{String(index + 1).padStart(2, '0')}
            </div>

            <h2 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-12">
              {question.text}
            </h2>

            <div className="space-y-3">
              {question.options.map((opt, i) => {
                const isSelected = selected === opt.text
                return (
                  <motion.button
                    key={opt.key}
                    onClick={() => choose(opt.text)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    className={`relative w-full text-left px-6 py-5 border transition-colors ${
                      isSelected
                        ? 'border-ink-900 bg-ink-900 text-ink-50'
                        : 'border-ink-900/20 hover:border-ink-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <span className={`font-mono text-xs tabular ${isSelected ? 'text-ink-50/60' : 'text-ink-900/40'}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-ink-50' : 'border-ink-900/30'
                      }`}>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              className="w-2 h-2 rounded-full bg-ink-50"
                            />
                          )}
                        </AnimatePresence>
                      </span>
                      <span className="flex-1 text-lg">{opt.text}</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex items-center justify-between"
        >
          <button
            onClick={prev}
            disabled={index === 0}
            className="font-mono text-xs tracking-widest uppercase text-ink-900/60 hover:text-ink-900 disabled:opacity-30"
          >
            ← previous
          </button>

          <motion.button
            onClick={next}
            disabled={!canProceed || submitting}
            whileHover={canProceed ? { scale: 1.02 } : {}}
            whileTap={canProceed ? { scale: 0.98 } : {}}
            className={`px-8 py-4 font-display text-lg transition-colors ${
              canProceed && !submitting
                ? 'bg-ink-900 text-ink-50 hover:bg-coral-accent'
                : 'bg-ink-900/20 text-ink-900/40 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Submitting…' : isLast ? 'Submit answers  →' : 'Next question  →'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}