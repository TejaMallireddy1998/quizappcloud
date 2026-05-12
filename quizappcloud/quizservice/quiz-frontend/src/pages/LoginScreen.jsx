import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import PasswordInput from '../components/PasswordInput'

export default function LoginScreen({ onRegister }) {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const submit = async () => {
    if (!username || !password) return
    setBusy(true)
    setError(null)
    try {
      await login({ username, password })
      // AuthContext changes cause App.jsx to re-render → main app shows
    } catch (e) {
      setError('Invalid username or password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative min-h-screen grain overflow-hidden">
      <motion.div
        className="absolute top-10 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--amber), transparent 70%)' }}
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-md mx-auto px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="font-display italic text-2xl mb-2">Quizzr</div>
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-900/50">
            est. 2026
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-xs tracking-[0.3em] uppercase text-coral-accent mb-4"
        >
          Sign in
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-5xl leading-[0.95] tracking-tight mb-12"
        >
          Welcome <em className="italic text-coral-accent">back.</em>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <div>
            <label className="font-mono text-xs tracking-widest uppercase text-ink-900/60 block mb-2">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              autoFocus
              className="w-full px-4 py-3 bg-transparent border-b-2 border-ink-900/30 focus:border-ink-900 outline-none font-display text-2xl"
            />
          </div>

          <div>
            <label className="font-mono text-xs tracking-widest uppercase text-ink-900/60 block mb-2">
                Password
            </label>
            <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            </div>

          <motion.button
            onClick={submit}
            disabled={busy || !username || !password}
            whileHover={!busy ? { scale: 1.01 } : {}}
            whileTap={!busy ? { scale: 0.99 } : {}}
            className={`w-full px-8 py-5 font-display text-xl transition-colors ${
              busy || !username || !password
                ? 'bg-ink-900/20 text-ink-900/40 cursor-not-allowed'
                : 'bg-ink-900 text-ink-50 hover:bg-coral-accent'
            }`}
          >
            {busy ? 'Signing in…' : 'Sign in  →'}
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
            <span className="text-ink-900/60 text-sm">No account?  </span>
            <button
              onClick={onRegister}
              className="font-mono text-xs tracking-widest uppercase text-ink-900 hover:text-coral-accent"
            >
              Register →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
