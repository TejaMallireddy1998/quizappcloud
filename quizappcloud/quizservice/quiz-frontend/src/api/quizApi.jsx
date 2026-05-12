const BASE = import.meta.env.VITE_API_BASE || '/api'

// Token storage — simple module-level state.
// Auth context writes here on login / clears on logout.
let authToken = null
let onUnauthorized = null

export function setAuthToken(token) {
  authToken = token
}

export function setOnUnauthorized(handler) {
  onUnauthorized = handler
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  // Global 401 handler — token expired or invalid
  if (res.status === 401 && onUnauthorized) {
    onUnauthorized()
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.text()
}

// ───────────── Auth ─────────────
export const login = ({ username, password }) =>
  request('/auth-service/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

export const register = ({ username, email, password, role }) =>
  request('/auth-service/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, role }),
  })

// ───────────── Quiz ─────────────
export const createQuiz = ({ categoryName, numQ, title }) =>
  request('/quiz-service/quiz/create', {
    method: 'POST',
    body: JSON.stringify({ categoryName, numQ, title }),
  })

  export const deleteQuiz = (id) =>
  request(`/quiz-service/quiz/delete/${id}`, { method: 'DELETE' })

export const getQuizQuestions = (id) =>
  request(`/quiz-service/quiz/get/${id}`)

export const listQuizzes = () =>
  request('/quiz-service/quiz/list')

export const submitQuiz = (id, responses, timeTakenSeconds) =>
  request(`/quiz-service/quiz/submit/${id}`, {
    method: 'POST',
    headers: timeTakenSeconds ? { 'X-Time-Taken-Seconds': String(timeTakenSeconds) } : {},
    body: JSON.stringify(responses),
  })

export const getMyAttempts = () =>
  request('/quiz-service/quiz/attempts')

// ───────────── Question (admin) ─────────────
export const getAllQuestions = () =>
  request('/question-service/question/allQuestions')

export const getQuestionsByCategory = (category) =>
  request(`/question-service/question/category/${encodeURIComponent(category)}`)

// ───────────── Helpers ─────────────
export function normalizeQuestion(qw) {
  return {
    id: qw.id,
    text: qw.questionTitle,
    options: [qw.option1, qw.option2, qw.option3, qw.option4]
      .filter((o) => o != null && o !== '')
      .map((text, idx) => ({ key: `opt${idx + 1}`, text })),
  }
}