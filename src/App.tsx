import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Toast from './components/Toast'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const ExplorePage = lazy(() => import('./pages/ExplorePage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const LearningPage = lazy(() => import('./pages/LearningPage'))
const LessonPage = lazy(() => import('./pages/LessonPage'))
const MaterialsPage = lazy(() => import('./pages/MaterialsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const QuizPage = lazy(() => import('./pages/QuizPage'))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'))
const ScientistsPage = lazy(() => import('./pages/ScientistsPage'))
const TopicDetailPage = lazy(() => import('./pages/TopicDetailPage'))

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toast />
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-space-black px-6 text-center text-slate-300">
              Loading page…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/learning/:slug" element={<TopicDetailPage />} />
            <Route path="/learning/:slug/:lessonSlug" element={<LessonPage />} />
            <Route path="/learning/:slug/quiz" element={<QuizPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminPage />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/scientists" element={<ScientistsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
