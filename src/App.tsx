import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Toast from './components/Toast'
import AboutPage from './pages/AboutPage'
import AdminPage from './pages/AdminPage'
import ArticlesPage from './pages/ArticlesPage'
import ChatPage from './pages/ChatPage'
import ExplorePage from './pages/ExplorePage'
import HomePage from './pages/HomePage'
import LearningPage from './pages/LearningPage'
import LessonPage from './pages/LessonPage'
import MaterialsPage from './pages/MaterialsPage'
import NotFoundPage from './pages/NotFoundPage'
import ResourcesPage from './pages/ResourcesPage'
import ScientistsPage from './pages/ScientistsPage'
import TopicDetailPage from './pages/TopicDetailPage'
import QuizPage from './pages/QuizPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toast />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/learning/:slug" element={<TopicDetailPage />} />
          <Route path="/learning/:slug/:lessonSlug" element={<LessonPage />} />
          <Route path="/learning/:slug/quiz" element={<QuizPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/scientists" element={<ScientistsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
