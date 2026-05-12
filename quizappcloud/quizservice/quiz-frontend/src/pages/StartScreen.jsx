import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { listQuizzes, deleteQuiz } from '../api/quizApi'

export default function StartScreen({ onStart, onAdmin, onHistory }) {
  const { auth, logout, hasRole } = useAuth()
  const [quizzes, setQuizzes] = useState(null)
  const [error, setError] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [duration, setDuration] = useState(120)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    listQuizzes()
      .then(setQuizzes)
      .catch((e) => setError(e.message))
  }, [])

  const start = () => {
    if (!selectedQuiz) return
    onStart(selectedQuiz.id, duration)
  }

  const handleDelete = async (e, quiz) => {
  e.stopPropagation()  // don't trigger the quiz-select click
  if (!confirm(`Delete "${quiz.title}"? This cannot be undone.`)) return
  setDeletingId(quiz.id)
  try {
    await deleteQuiz(quiz.id)
    // Clear selection if we deleted the selected quiz
    if (selectedQuiz?.id === quiz.id) setSelectedQuiz(null)
    // Reload the list
    const fresh = await listQuizzes()
    setQuizzes(fresh)
  } catch (err) {
    alert('Could not delete quiz: ' + err.message)
  } finally {
    setDeletingId(null)
  }
}

  return (
    <div className="relative min-h-screen grain overflow-hidden">
      <motion.div
        className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--amber), transparent 70%)' }}
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--coral), transparent 70%)' }}
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-8 py-16">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between border-b border-ink-900/20 pb-6 mb-16 flex-wrap gap-3"
        >
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-ink-900/60">
            Vol. 01 · {auth?.username}
          </div>
          <div className="font-display italic text-xl">Quizzr</div>
          <div className="flex items-center gap-4 font-mono text-xs tracking-[0.2em] uppercase">
            <button onClick={onHistory} className="text-ink-900/60 hover:text-coral-accent transition-colors">
              History
            </button>
            {hasRole('ADMIN') && (
              <button onClick={onAdmin} className="text-ink-900/60 hover:text-coral-accent transition-colors">
                Admin
              </button>
            )}
            <button onClick={logout} className="text-ink-900/60 hover:text-coral-accent transition-colors">
              Logout
            </button>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-xs tracking-[0.3em] uppercase text-coral-accent mb-6"
        >
          ·  A thoughtful quiz experience  ·
        </motion.div>

        <motion.h1
          className="font-display text-7xl md:text-9xl leading-[0.9] tracking-tight mb-8"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
        >
          {['Think', 'carefully,', 'answer', 'boldly.'].map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-4"
              variants={{
                hidden: { y: 80, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              {i === 2 ? <em className="italic text-coral-accent">{word}</em> : word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Quiz list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-2xl">Choose a quiz</h2>
            {quizzes && (
              <div className="font-mono text-xs tracking-widest uppercase text-ink-900/50">
                {quizzes.length} available
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 border-l-4 border-coral-accent bg-coral-accent/10 font-mono text-sm text-coral-accent mb-6">
              Could not load quizzes: {error}
            </div>
          )}

          {!error && quizzes === null && (
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-mono text-sm tracking-widest uppercase text-ink-900/60 text-center py-12"
            >
              Loading…
            </motion.div>
          )}

          {quizzes !== null && quizzes.length === 0 && (
            <div className="py-12 text-center text-ink-900/50 font-mono text-sm">
              No quizzes available yet.
              {hasRole('ADMIN') && ' Create one in the Admin panel.'}
            </div>
          )}

          {quizzes !== null && quizzes.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
              className="divide-y divide-ink-900/10 border-y border-ink-900/10 mb-8"
            >
              {quizzes.map((q, i) => {
                const isSelected = selectedQuiz?.id === q.id
                return (
                  <motion.button
  key={q.id}
  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
  onMouseEnter={() => setHoveredId(q.id)}
  onMouseLeave={() => setHoveredId(null)}
  onClick={() => setSelectedQuiz(q)}
  className={`group relative w-full text-left py-6 px-4 flex items-baseline gap-6 transition-colors ${
    isSelected ? 'bg-ink-900/[0.04]' : 'hover:bg-ink-900/[0.02]'
  }`}
>
  <span className="font-mono text-sm text-ink-900/40 w-10">
    №{String(i + 1).padStart(2, '0')}
  </span>
  <div className="flex-1 min-w-0">
    <div className="flex items-baseline gap-3 flex-wrap">
      <h3 className="font-display text-2xl tracking-tight">
        {q.title}
      </h3>
      {isSelected && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 border border-coral-accent text-coral-accent rounded-full"
        >
          Selected
        </motion.span>
      )}
    </div>
  </div>
  <div className="font-mono text-xs text-ink-900/50 whitespace-nowrap">
    {q.questionCount} questions
  </div>

  {/* Delete button — admin only */}
  {hasRole('ADMIN') && (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => handleDelete(e, q)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleDelete(e, q)}
      className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 border transition-colors cursor-pointer ${
        deletingId === q.id
          ? 'border-ink-900/20 text-ink-900/40 cursor-not-allowed'
          : 'border-ink-900/20 text-ink-900/50 hover:border-coral-accent hover:text-coral-accent'
      }`}
    >
      {deletingId === q.id ? '…' : 'Delete'}
    </span>
  )}

  <motion.div
    animate={{ x: hoveredId === q.id ? 8 : 0 }}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    className={`font-display text-2xl ${isSelected ? 'text-coral-accent' : 'text-ink-900/40'}`}
  >
    →
  </motion.div>
</motion.button>
                )
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Duration + Begin button — only show when a quiz is selected */}
        <AnimatePresence>
          {selectedQuiz && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 border-t border-ink-900/10 pt-8"
            >
              <div>
                <label className="font-mono text-xs tracking-widest uppercase text-ink-900/60 block mb-2">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value, 10) || 60)}
                  className="w-full px-5 py-4 bg-transparent border-b-2 border-ink-900/30 focus:border-ink-900 outline-none font-display text-2xl transition-colors"
                />
              </div>

              <motion.button
                onClick={start}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-5 font-display text-xl tracking-tight bg-ink-900 text-ink-50 hover:bg-coral-accent transition-colors"
              >
                Begin <span className="italic">"{selectedQuiz.title}"</span>  →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-24 pt-8 border-t border-ink-900/20 flex justify-between items-center font-mono text-xs tracking-widest uppercase text-ink-900/50"
        >
          <div>est. 2026</div>
          <div>est. truth</div>
          <div>est. curiosity</div>
        </motion.footer>
      </div>
    </div>
  )
}