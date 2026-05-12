import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import PasswordInput from '../components/PasswordInput'

export default function RegisterScreen({ onLogin }) {
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const submit = async () => {
    if (!username || !email || !password) return
    setBusy(true)
    setError(null)
    try {
      await register({ username, email, password })
    } catch (e) {
      setError(e.message.includes('already') ? e.message : 'Could not create account')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative min-h-screen grain overflow-hidden">
      <motion.div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--coral), transparent 70%)' }}
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-md mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="font-display italic text-2xl mb-2">Quizzr</div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-900/50">
            est. 2026
          </div>
        </motion.div>

        <div className="font-mono text-xs tracking-[0.3em] uppercase text-coral-accent mb-4">
          Create an account
        </div>
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight mb-12">
          Begin your <em className="italic text-coral-accent">journey.</em>
        </h1>

        <div className="space-y-6">
          <Field label="Username">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              className="w-full px-4 py-3 bg-transparent border-b-2 border-ink-900/30 focus:border-ink-900 outline-none font-display text-2xl"
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border-b-2 border-ink-900/30 focus:border-ink-900 outline-none font-display text-2xl"
            />
          </Field>
            <Field label="Password">
            <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="min. 6 characters"
            />
            </Field>

          <motion.button
            onClick={submit}
            disabled={busy || !username || !email || !password}
            whileHover={!busy ? { scale: 1.01 } : {}}
            whileTap={!busy ? { scale: 0.99 } : {}}
            className={`w-full px-8 py-5 font-display text-xl transition-colors ${
              busy || !username || !email || !password
                ? 'bg-ink-900/20 text-ink-900/40 cursor-not-allowed'
                : 'bg-ink-900 text-ink-50 hover:bg-coral-accent'
            }`}
          >
            {busy ? 'Creating…' : 'Create account  →'}
          </motion.button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 border-l-4 border-coral-accent bg-coral-accent/10 font-mono text-sm text-coral-accent"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center pt-6 border-t border-ink-900/10">
            <span className="text-ink-900/60 text-sm">Already have an account?  </span>
            <button
              onClick={onLogin}
              className="font-mono text-xs tracking-widest uppercase text-ink-900 hover:text-coral-accent"
            >
              Sign in →
            </button>
          </div>
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