import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import StartScreen from './pages/StartScreen'
import QuizScreen from './pages/QuizScreen'
import ResultsScreen from './pages/ResultsScreen'
import AdminScreen from './pages/AdminScreen'
import LoginScreen from './pages/LoginScreen'
import RegisterScreen from './pages/RegisterScreen'
import HistoryScreen from './pages/HistoryScreen'

function Shell() {
  const { auth } = useAuth()
  // authScreen tracks which auth-view to show when logged out
  const [authScreen, setAuthScreen] = useState('login') // 'login' | 'register'
  // screen tracks the in-app route when logged in
  const [screen, setScreen] = useState('start') // 'start' | 'admin' | 'quiz' | 'results' | 'history'
  const [quizId, setQuizId] = useState(null)
  const [duration, setDuration] = useState(120)
  const [result, setResult] = useState(null)

  const startQuiz = (id, d) => { setQuizId(id); setDuration(d); setScreen('quiz') }
  const completeQuiz = (r) => { setResult(r); setScreen('results') }
  const goHome = () => { setScreen('start'); setQuizId(null); setResult(null) }
  const retry = () => { setResult(null); setScreen('quiz') }

  // Not logged in → show login/register
  if (!auth) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={authScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {authScreen === 'login' && (
            <LoginScreen onRegister={() => setAuthScreen('register')} />
          )}
          {authScreen === 'register' && (
            <RegisterScreen onLogin={() => setAuthScreen('login')} />
          )}
        </motion.div>
      </AnimatePresence>
    )
  }

  // Logged in → main app
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen + (quizId || '')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {screen === 'start' && (
          <StartScreen
            onStart={startQuiz}
            onAdmin={() => setScreen('admin')}
            onHistory={() => setScreen('history')}
          />
        )}
        {screen === 'admin' && <AdminScreen onBack={goHome} />}
        {screen === 'history' && <HistoryScreen onBack={goHome} />}
        {screen === 'quiz' && (
          <QuizScreen
            quizId={quizId}
            duration={duration}
            onComplete={completeQuiz}
            onExit={goHome}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen result={result} onRetry={retry} onHome={goHome} />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}