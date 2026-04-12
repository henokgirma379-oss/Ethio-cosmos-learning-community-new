import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
import { useAuth } from '../context/AuthContext'
import { getQuizAttempt, getQuizQuestions, getTopicBySlug, saveQuizAttempt } from '../lib/api'
import type { QuizAttempt, QuizQuestion, Topic } from '../types'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Scientists', path: '/scientists' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
]

type AnswerOption = 'a' | 'b' | 'c' | 'd'

export default function QuizPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [previousAttempt, setPreviousAttempt] = useState<QuizAttempt | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerOption>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    const loadQuizData = async () => {
      setLoading(true)
      setSubmitted(false)
      setScore(0)
      setAnswers({})
      setCurrentIndex(0)
      setPreviousAttempt(null)

      const topicData = await getTopicBySlug(slug)
      setTopic(topicData)

      if (!topicData) {
        setQuestions([])
        setLoading(false)
        return
      }

      const questionData = await getQuizQuestions(topicData.id)
      setQuestions(questionData)

      if (user) {
        const attemptData = await getQuizAttempt(user.id, topicData.id)
        setPreviousAttempt(attemptData)
      }

      setLoading(false)
    }

    void loadQuizData()
  }, [slug, user])

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0

  const handleSelectAnswer = (questionId: string, option: AnswerOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!topic) return

    const calculatedScore = questions.reduce((total, question) => {
      return total + (answers[question.id] === question.correct_option ? 1 : 0)
    }, 0)

    setScore(calculatedScore)
    setSubmitted(true)

    if (user) {
      try {
        await saveQuizAttempt(user.id, topic.id, calculatedScore, totalQuestions)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to save quiz attempt.')
      }
    }

    toast.success(`Quiz submitted! You scored ${calculatedScore}/${totalQuestions}`)
  }

  const handleRetake = () => {
    setAnswers({})
    setCurrentIndex(0)
    setSubmitted(false)
    setScore(0)
  }

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-3xl animate-fadeIn px-6 pb-20 pt-20">
        <Link to={'/learning/' + slug} className="inline-flex items-center gap-2 text-sm text-teal">← Back to topic</Link>

        {loading ? (
          <div className="mt-6 animate-pulse space-y-4">
            <div className="h-10 w-2/3 rounded-2xl bg-deep-navy" />
            <div className="h-48 rounded-3xl bg-deep-navy" />
            <div className="h-16 rounded-2xl bg-deep-navy" />
            <div className="h-16 rounded-2xl bg-deep-navy" />
          </div>
        ) : !topic ? (
          <div className="mt-10 rounded-2xl bg-deep-navy p-8 text-slate-300">Topic not found.</div>
        ) : questions.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-deep-navy/90 p-8 text-center">
            <h1 className="font-display text-3xl text-white">No quiz questions yet for this topic.</h1>
            <Link to={'/learning/' + slug} className="mt-6 inline-block rounded-lg bg-teal px-6 py-3 font-semibold text-slate-950">
              Back to Topic
            </Link>
          </div>
        ) : (
          <>
            {previousAttempt && !submitted && (
              <div className="mt-6 rounded-3xl border border-white/10 bg-deep-navy/90 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-2xl text-white">Previous Attempt</h2>
                    <p className="mt-2 text-slate-300">
                      Your last saved score was {previousAttempt.score} / {previousAttempt.total} ({previousAttempt.percentage ?? Math.round((previousAttempt.score / Math.max(previousAttempt.total, 1)) * 100)}%).
                    </p>
                  </div>
                  <button onClick={handleRetake} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">
                    Retake Quiz
                  </button>
                </div>
              </div>
            )}

            {!submitted ? (
              <div className="mt-6 space-y-6">
                <div className="rounded-3xl border border-white/10 bg-deep-navy/90 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-300">Question {currentIndex + 1} of {totalQuestions}</span>
                    <span className="text-sm text-teal">{progress}%</span>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-navy/60">
                    <div className="h-3 rounded-full bg-teal transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {currentQuestion && (
                  <div className="rounded-3xl border border-white/5 bg-deep-navy/90 p-8">
                    <h1 className="font-display text-xl text-white">{currentQuestion.question}</h1>
                    <div className="mt-6 space-y-3">
                      {([
                        ['a', currentQuestion.option_a],
                        ['b', currentQuestion.option_b],
                        ['c', currentQuestion.option_c],
                        ['d', currentQuestion.option_d],
                      ] as Array<[AnswerOption, string]>).map(([optionKey, optionText]) => {
                        const isSelected = answers[currentQuestion.id] === optionKey
                        return (
                          <button
                            key={optionKey}
                            onClick={() => handleSelectAnswer(currentQuestion.id, optionKey)}
                            className={`flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition ${isSelected ? 'border-teal bg-teal/20 text-teal' : 'border-white/10 bg-navy/60 text-slate-300'}`}
                          >
                            <span className="font-semibold uppercase">{optionKey}</span>
                            <span>{optionText}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="rounded-lg border border-white/10 px-5 py-3 font-semibold text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === totalQuestions - 1}
                    className="rounded-lg border border-white/10 px-5 py-3 font-semibold text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                  {currentIndex === totalQuestions - 1 && (
                    <button
                      onClick={() => void handleSubmit()}
                      disabled={Object.keys(answers).length < totalQuestions}
                      className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                <div className="rounded-3xl border border-white/10 bg-deep-navy/90 p-8 text-center">
                  <div className="font-display text-5xl text-white">{score} / {totalQuestions}</div>
                  <div className="mt-3 text-xl text-teal">{percentage}%</div>
                  <div className={`mt-4 text-lg font-semibold ${percentage >= 70 ? 'text-teal' : percentage >= 40 ? 'text-gold' : 'text-slate-300'}`}>
                    {percentage >= 70 ? '🎉 Excellent work!' : percentage >= 40 ? '📚 Keep studying!' : "💪 Don't give up!"}
                  </div>
                  {!user && (
                    <p className="mt-4 text-slate-400">Sign in to save your quiz results.</p>
                  )}
                </div>

                <div className="space-y-4">
                  {questions.map((question) => {
                    const userAnswer = answers[question.id]
                    const correctAnswer = question.correct_option
                    const optionMap: Record<AnswerOption, string> = {
                      a: question.option_a,
                      b: question.option_b,
                      c: question.option_c,
                      d: question.option_d,
                    }

                    return (
                      <div key={question.id} className="rounded-3xl border border-white/10 bg-deep-navy/90 p-6">
                        <h2 className="font-display text-xl text-white">{question.question}</h2>
                        <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${userAnswer === correctAnswer ? 'bg-teal/20 text-teal' : 'bg-red-500/10 text-red-300'}`}>
                          Your answer: {userAnswer ? `${userAnswer.toUpperCase()}. ${optionMap[userAnswer]}` : 'No answer selected'}
                        </div>
                        <div className="mt-3 rounded-2xl bg-teal/20 px-4 py-3 text-sm text-teal">
                          Correct answer: {correctAnswer.toUpperCase()}. {optionMap[correctAnswer]}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button onClick={handleRetake} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">
                    Retake Quiz
                  </button>
                  <button onClick={() => navigate('/learning/' + slug)} className="rounded-lg border border-white/10 px-5 py-3 font-semibold text-slate-300">
                    Back to Topic
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
