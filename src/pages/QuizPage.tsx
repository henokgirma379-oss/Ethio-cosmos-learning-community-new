import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import { getTopicBySlug } from '../lib/api'
import { supabase } from '../lib/supabase'
import type { Topic } from '../types'
import { useAuth } from '../context/AuthContext'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

type QuizQuestion = {
  id: string
  topic_id: string
  question: string
  options: string[]
  correct_answer: string
  explanation?: string | null
}

export default function QuizPage() {
  const { slug = '' } = useParams()
  const { user } = useAuth()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    const loadQuiz = async () => {
      const topicData = await getTopicBySlug(slug)
      setTopic(topicData)

      if (!topicData || !supabase) {
        setQuestions([])
        return
      }

      const { data } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('topic_id', topicData.id)

      const parsed = ((data ?? []) as Array<QuizQuestion & { options: string[] | string }>).map((item) => ({
        ...item,
        options: Array.isArray(item.options) ? item.options : [],
      }))
      setQuestions(parsed)
    }

    void loadQuiz()
  }, [slug])

  const score = useMemo(
    () => questions.reduce((total, question) => total + (answers[question.id] === question.correct_answer ? 1 : 0), 0),
    [answers, questions],
  )

  useEffect(() => {
    if (!submitted || !user || !topic || !supabase) return

    void supabase.from('quiz_attempts').insert({
      user_id: user.id,
      topic_id: topic.id,
      score,
      total_questions: questions.length,
    })
  }, [submitted, user, topic, score, questions.length])

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,92,191,0.12),_transparent_30%),linear-gradient(180deg,_rgba(5,10,26,0.76),_rgba(5,10,26,0.95))]" />
      <div className="fixed inset-0 bg-space-black/70" />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-24">
        <div className="rounded-3xl border border-white/10 bg-deep-navy/85 p-8 shadow-xl shadow-black/20">
          <Link to={topic ? `/learning/${topic.slug}` : '/learning'} className="text-sm text-teal hover:text-white">
            ← Back to topic
          </Link>
          <h1 className="mt-4 font-display text-4xl text-white">{topic ? `${topic.title} Quiz` : 'Topic Quiz'}</h1>
          <p className="mt-4 text-slate-300">
            Test your understanding with quick knowledge checks. Your attempts are saved when you are signed in.
          </p>
        </div>

        <section className="mt-8 space-y-6">
          {questions.length ? (
            questions.map((question, index) => (
              <div key={question.id} className="rounded-3xl border border-white/10 bg-deep-navy/85 p-6">
                <h2 className="text-xl font-semibold text-white">{index + 1}. {question.question}</h2>
                <div className="mt-4 grid gap-3">
                  {question.options.map((option) => {
                    const selected = answers[question.id] === option
                    const isCorrect = submitted && option === question.correct_answer
                    const isWrong = submitted && selected && option !== question.correct_answer
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => !submitted && setAnswers((prev) => ({ ...prev, [question.id]: option }))}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          isCorrect
                            ? 'border-green-400 bg-green-500/10 text-green-300'
                            : isWrong
                              ? 'border-red-400 bg-red-500/10 text-red-300'
                              : selected
                                ? 'border-teal bg-teal/10 text-teal'
                                : 'border-white/10 bg-navy/60 text-slate-200 hover:border-teal/30'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
                {submitted && question.explanation && (
                  <p className="mt-4 rounded-2xl bg-navy/60 p-4 text-sm leading-7 text-slate-300">{question.explanation}</p>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-deep-navy/80 p-8 text-slate-400">
              No quiz questions are available for this topic yet.
            </div>
          )}
        </section>

        {questions.length > 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-deep-navy/85 p-6">
            {submitted ? (
              <div>
                <h3 className="font-display text-2xl text-gold">Your score: {score} / {questions.length}</h3>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setAnswers({})
                  }}
                  className="mt-4 rounded-lg border border-white/10 px-5 py-3 text-slate-200"
                >
                  Retake Quiz
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="rounded-lg bg-teal px-6 py-3 font-semibold text-slate-950"
              >
                Submit Answers
              </button>
            )}
          </div>
        )}
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
