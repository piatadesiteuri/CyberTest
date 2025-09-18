'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { BookOpen, Clock, CheckCircle, ArrowLeft, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string
  content: string
  type: 'theory' | 'practical' | 'video' | 'interactive' | 'documentation'
  order: number
  estimatedDuration: number
  userProgress?: {
    status: 'not_started' | 'in_progress' | 'completed'
    completedAt?: string
    timeSpent?: number
  }
}

interface Course {
  id: string
  title: string
  modules: Module[]
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
  order: number
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        console.log('🔍 Fetching lesson with ID:', lessonId, 'from course:', courseId)
        
        // First, get the course data to find the lesson
        const courseResponse = await fetch(`http://localhost:3001/api/courses/${courseId}`)
        if (!courseResponse.ok) {
          throw new Error('Failed to fetch course')
        }
        
        const courseData = await courseResponse.json()
        if (!courseData.success) {
          throw new Error(courseData.message || 'Failed to fetch course')
        }
        
        console.log('📊 Course data received:', courseData.course)
        
        // Find the lesson in the course modules
        const foundLesson = courseData.course.modules
          .flatMap((module: any) => module.lessons || [])
          .find((l: any) => l.id === lessonId)
        
        console.log('🔍 Looking for lesson ID:', lessonId)
        console.log('📚 Available lessons:', courseData.course.modules.flatMap((m: any) => m.lessons || []).map((l: any) => ({ id: l.id, title: l.title })))
        
        if (foundLesson) {
          console.log('✅ Lesson found:', foundLesson)
          setLesson(foundLesson)
          setCourse(courseData.course)
          setTimeSpent(foundLesson.userProgress?.timeSpent || 0)
          setIsCompleted(foundLesson.userProgress?.status === 'completed')
        } else {
          console.log('❌ Lesson not found in course data')
          setLesson(null)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('❌ Error fetching lesson:', error)
        setLesson(null)
        setLoading(false)
      }
    }

    fetchLesson()
  }, [courseId, lessonId])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, isCompleted])

  const handleComplete = async () => {
    if (!lesson || !user) return

    try {
      // TODO: Replace with actual API call
      console.log('Completing lesson:', lesson.id, 'for user:', user.id)
      
      setIsCompleted(true)
      setIsPlaying(false)
      
      // Here you would save to database:
      // await learningService.updateUserProgress({
      //   userId: user.id,
      //   lessonId: lesson.id,
      //   status: 'completed',
      //   timeSpent: timeSpent
      // })
      
    } catch (error) {
      console.error('Error completing lesson:', error)
    }
  }

  const handleNext = () => {
    if (!course) return

    const allLessons = course.modules.flatMap(module => module.lessons)
    const currentIndex = allLessons.findIndex(l => l.id === lessonId)
    const nextLesson = allLessons[currentIndex + 1]

    if (nextLesson) {
      router.push(`/learning/${courseId}/lesson/${nextLesson.id}`)
    } else {
      // Go to quiz or next module
      router.push(`/learning/${courseId}/quiz/fundamentals-quiz`)
    }
  }

  const handlePrevious = () => {
    if (!course) return

    const allLessons = course.modules.flatMap(module => module.lessons)
    const currentIndex = allLessons.findIndex(l => l.id === lessonId)
    const previousLesson = allLessons[currentIndex - 1]

    if (previousLesson) {
      router.push(`/learning/${courseId}/lesson/${previousLesson.id}`)
    } else {
      router.push(`/learning/${courseId}`)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-copper mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h1>
          <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push(`/learning/${courseId}`)}
            className="bg-warm-copper text-white px-6 py-2 rounded-lg hover:bg-warm-bronze transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-500 hover:text-warm-copper transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Dashboard</span>
              </button>
              <div className="h-4 w-px bg-gray-300"></div>
              <button
                onClick={() => router.push(`/learning/${courseId}`)}
                className="flex items-center text-gray-600 hover:text-warm-copper transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Course
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-600">{lesson.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeSpent)} / {lesson.estimatedDuration} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 capitalize">{lesson.type}</span>
                {isCompleted && <CheckCircle className="w-5 h-5 text-warm-copper" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Lesson Content */}
          <div className="p-8">
            <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-strong:text-gray-900">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: lesson.content
                    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mb-6">$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-900 mb-4 mt-8">$1</h2>')
                    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">$1</h3>')
                    .replace(/^\- \*\*(.*?)\*\*: (.*$)/gim, '<li class="mb-2"><strong class="text-gray-900">$1</strong>: $2</li>')
                    .replace(/^\- (.*$)/gim, '<li class="mb-2">$1</li>')
                    .replace(/^\d+\. \*\*(.*?)\*\*: (.*$)/gim, '<li class="mb-2"><strong class="text-gray-900">$1</strong>: $2</li>')
                    .replace(/^\d+\. (.*$)/gim, '<li class="mb-2">$1</li>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>')
                    .replace(/\n\n/g, '</p><p class="mb-4">')
                    .replace(/\n/g, '<br>')
                    .replace(/^(?!<[h|l])/gm, '<p class="mb-4">')
                    .replace(/(<li.*<\/li>)/gs, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>')
                    .replace(/(<h[1-6].*<\/h[1-6]>)/g, '$1')
                }} 
              />
            </div>
          </div>

          {/* Lesson Controls */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center space-x-2 bg-warm-copper text-white px-4 py-2 rounded-lg hover:bg-warm-bronze transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                
                <button
                  onClick={() => setTimeSpent(0)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-warm-copper transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePrevious}
                  className="flex items-center space-x-2 text-gray-600 hover:text-warm-copper transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {!isCompleted ? (
                  <button
                    onClick={handleComplete}
                    className="bg-warm-copper text-white px-6 py-2 rounded-lg hover:bg-warm-bronze transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Complete</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="bg-warm-copper text-white px-6 py-2 rounded-lg hover:bg-warm-bronze transition-colors flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
