import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell'
import Card from '../components/Card'
import { getTopicBySlug } from '../lib/api'
import { supabase } from '../lib/supabase'
import { PRIMARY_NAV_LINKS } from '../lib/constants'
import { useAuth } from '../context/AuthContext'
import type { Topic } from '../types'

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

  useEffect(() => {
    const loadQuiz = async () => {
      const topicData = await getTopicBySlug(slug)
      setTopic(topicData)

      if (!topicData || !supabase) {
        setQuestions([])
        return
      }

      const { data } = await supabase.from('quiz_questions').select('*').eq('topic_id', topicData.id)

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
    <PageShell navLinks={PRIMARY_NAV_LINKS} gradientStyle="default">
      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-32">
        {/* Header */}
        <Card variant="default" borderStyle="default" padding="lg">
          <Link to={topic ? `/learning/${topic.slug}` : '/learning'} className="text-sm text-teal transition-colors duration-200 hover:text-white">
            ← Back to topic
          </Link>
          <h1 className="mt-4 font-display text-4xl text-white">{topic ? `${topic.title} Quiz` : 'Topic Quiz'}</h1>
          <p className="mt-4 text-slate-300">
            Test your understanding with quick knowledge checks. Your attempts are saved when you are signed in.
          </p>
        </Card>

        {/* Questions */}
        <section className="mt-8 space-y-6">
          {questions.length ? (
            questions.map((question, index) => (
              <Card key={question.id} variant="default" borderStyle="default" padding="md">
                <h2 className="text-xl font-semibold text-white">
                  {index + 1}. {question.question}
                </h2>
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
                        className={`rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                          isCorrect
                            ? 'border-green-400 bg-green-500/10 text-green-300'
                            : isWrong
                              ? 'border-red-400 bg-red-500/10 text-red-300'
                              : selected
                                ? 'border-teal bg-teal/10 text-teal'
                                : 'border-white/10 bg-navy/60 text-slate-200 hover:border-teal/30 hover:text-teal'
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
              </Card>
            ))
          ) : (
            <Card variant="default" borderStyle="default" padding="lg" className="border-dashed text-center">
              <div className="text-slate-400">No quiz questions are available for this topic yet.</div>
            </Card>
          )}
        </section>

        {/* Submit/Results */}
        {questions.length > 0 && (
          <Card variant="default" borderStyle="default" padding="md" className="mt-8">
            {submitted ? (
              <div>
                <h3 className="font-display text-2xl text-gold">
                  Your score: {score} / {questions.length}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setAnswers({})
                  }}
                  className="mt-4 rounded-lg border border-white/10 px-5 py-3 text-slate-200 transition-all duration-200 hover:border-teal/30 hover:text-teal"
                >
                  Retake Quiz
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="rounded-lg bg-teal px-6 py-3 font-semibold text-slate-950 transition-all duration-200 hover:scale-105 hover:brightness-110"
              >
                Submit Answers
              </button>
            )}
          </Card>
        )}
      </main>
    </PageShell>
  )
}
