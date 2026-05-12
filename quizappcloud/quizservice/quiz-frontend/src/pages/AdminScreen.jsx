import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createQuiz } from '../api/quizApi'

export default function AdminScreen({ onBack }) {
  const [title, setTitle] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [numQ, setNumQ] = useState(5)
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  const submit = async () => {
  if (!title || !categoryName || !numQ) return
  setBusy(true)
  setStatus(null)
  try {
    const result = await createQuiz({ categoryName, numQ: parseInt(numQ, 10), title })
    setStatus({ type: 'ok', msg: String(result) })
    // Clear the form so admin can create another
    setTitle('')
    setCategoryName('')
    setNumQ(5)
  } catch (e) {
    setStatus({ type: 'err', msg: e.message })
  } finally {
    setBusy(false)
  }
}

  return (
    <div className="relative min-h-screen grain">
      <div className="relative z-10 max-w-2xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between border-b border-ink-900/20 pb-6 mb-12">
          <button
            onClick={onBack}
            className="font-mono text-xs tracking-widest uppercase text-ink-900/60 hover:text-ink-900"
          >
            ← back
          </button>
          <div className="font-display italic text-xl">Admin</div>
          <span />
        </div>

        <div className="font-mono text-xs tracking-[0.3em] uppercase text-coral-accent mb-4">
          Create a new quiz
        </div>
        <h1 className="font-display text-6xl leading-[0.95] tracking-tight mb-12">
          Shape the <em className="italic text-coral-accent">questions.</em>
        </h1>

        <div className="space-y-6">
          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Java Fundamentals"
              className="w-full px-4 py-3 bg-transparent border-b-2 border-ink-900/30 focus:border-ink-900 outline-none font-display text-2xl"
            />
          </Field>

          <Field label="Category">
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Java"
              className="w-full px-4 py-3 bg-transparent border-b-2 border-ink-900/30 focus:border-ink-900 outline-none font-display text-2xl"
            />
          </Field>

          <Field label="Number of questions">
            <input
              type="number"
              value={numQ}
              onChange={(e) => setNumQ(e.target.value)}
              min={1}
              max={50}
              className="w-full px-4 py-3 bg-transparent border-b-2 border-ink-900/30 focus:border-ink-900 outline-none font-display text-2xl"
            />
          </Field>

          <motion.button
            onClick={submit}
            disabled={busy || !title || !categoryName || !numQ}
            whileHover={!busy ? { scale: 1.01 } : {}}
            whileTap={!busy ? { scale: 0.99 } : {}}
            className={`w-full px-8 py-5 font-display text-xl transition-colors ${
              busy || !title || !categoryName || !numQ
                ? 'bg-ink-900/20 text-ink-900/40 cursor-not-allowed'
                : 'bg-ink-900 text-ink-50 hover:bg-coral-accent'
            }`}
          >
            {busy ? 'Creating…' : 'Create quiz  →'}
          </motion.button>

          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 border-l-4 font-mono text-sm ${
                  status.type === 'ok'
                    ? 'border-amber-accent bg-amber-accent/10'
                    : 'border-coral-accent bg-coral-accent/10 text-coral-accent'
                }`}
              >
                {status.msg}
                {status.type === 'ok' && (
                     <div className="mt-2 text-ink-900/70">
                        The new quiz will appear on the home screen.
                    </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="font-mono text-xs tracking-widest uppercase text-ink-900/60 block mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}