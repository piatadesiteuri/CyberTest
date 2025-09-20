'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Play, BookOpen, Clock, Award, CheckCircle, Lock, User, BarChart3 } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Course {
  id: string
  title: string
  description: string
  level: string
  estimatedDuration?: number
  enrolledUsers?: number
  completionRate?: number
}

interface Module {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  estimatedDuration: number
  isActive: boolean
}

interface Lesson {
  id: string
  moduleId: string
  title: string
  description: string
  content: string
  type: string
  order: number
  estimatedDuration: number
  completed?: boolean
}

interface Quiz {
  id: string
  moduleId: string
  title: string
  description: string
  type: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  completed?: boolean
  bestScore?: number
}

interface Progress {
  courseId: string
  completedLessons: string[]
  completedQuizzes: string[]
  overallProgress: number
  currentModule?: string
  currentLesson?: string
}

interface StudentCourseViewerProps {
  courseId: string
  userId: string
  onClose?: () => void
}

export default function StudentCourseViewer({ courseId, userId, onClose }: StudentCourseViewerProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<{ [moduleId: string]: Lesson[] }>({})
  const [quizzes, setQuizzes] = useState<{ [moduleId: string]: Quiz[] }>({})
  const [progress, setProgress] = useState<Progress | null>(null)
  const [expandedModules, setExpandedModules] = useState<{ [moduleId: string]: boolean }>({})
  const [currentView, setCurrentView] = useState<'overview' | 'lesson' | 'quiz'>('overview')
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    fetchCourseData()
  }, [courseId, userId])

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      
      // Fetch course details
      const courseResponse = await fetch(`${API_BASE_URL}/api/learning/courses/${courseId}`)
      if (courseResponse.ok) {
        const courseData = await courseResponse.json()
        setCourse(courseData.data || courseData)
      }

      // Fetch modules
      const modulesResponse = await fetch(`${API_BASE_URL}/api/learning/courses/${courseId}/modules`)
      if (modulesResponse.ok) {
        const modulesData = await modulesResponse.json()
        console.log('StudentCourseViewer API Response:', modulesData)
        
        // Handle different response structures
        let modulesList = []
        if (modulesData.success && modulesData.data && Array.isArray(modulesData.data)) {
          modulesList = modulesData.data
        } else if (modulesData.success && modulesData.data && modulesData.data.modules && Array.isArray(modulesData.data.modules)) {
          modulesList = modulesData.data.modules
        } else if (Array.isArray(modulesData)) {
          modulesList = modulesData
        } else if (modulesData.modules && Array.isArray(modulesData.modules)) {
          modulesList = modulesData.modules
        } else if (modulesData.data) {
          modulesList = modulesData.data || []
        }
        
        setModules(modulesList)
        
        // Fetch lessons and quizzes for each module - ensure modulesList is array
        if (Array.isArray(modulesList)) {
          for (const module of modulesList) {
            if (module && module.id) {
              await fetchModuleLessons(module.id)
              await fetchModuleQuizzes(module.id)
            }
          }
        }
      } else {
        // Mock data for development
        const mockCourse: Course = {
          id: courseId,
          title: 'Cybersecurity Fundamentals',
          description: 'Learn the basics of cybersecurity',
          level: 'foundation',
          estimatedDuration: 180,
          enrolledUsers: 1250,
          completionRate: 78
        }
        setCourse(mockCourse)
        
        const mockModules: Module[] = [
          {
            id: '1',
            courseId,
            title: 'Introduction to Cybersecurity',
            description: 'Basic concepts and terminology',
            order: 1,
            estimatedDuration: 60,
            isActive: true
          },
          {
            id: '2',
            courseId,
            title: 'Threat Landscape',
            description: 'Understanding current cyber threats',
            order: 2,
            estimatedDuration: 90,
            isActive: true
          }
        ]
        setModules(mockModules)
        
        // Mock lessons and quizzes
        setLessons({
          '1': [
            {
              id: '1',
              moduleId: '1',
              title: 'What is Cybersecurity?',
              description: 'Understanding the fundamentals',
              content: '<h2>Introduction to Cybersecurity</h2><p>Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks...</p><h3>Key Concepts</h3><ul><li>Confidentiality</li><li>Integrity</li><li>Availability</li></ul>',
              type: 'theory',
              order: 1,
              estimatedDuration: 15,
              completed: true
            },
            {
              id: '2',
              moduleId: '1',
              title: 'Security Principles',
              description: 'Core security principles',
              content: '<h2>Security Principles</h2><p>Learn about the fundamental principles that guide cybersecurity practices...</p>',
              type: 'theory',
              order: 2,
              estimatedDuration: 20,
              completed: false
            }
          ],
          '2': [
            {
              id: '3',
              moduleId: '2',
              title: 'Common Threats',
              description: 'Overview of cyber threats',
              content: '<h2>Common Cyber Threats</h2><p>Understanding the landscape of cyber threats...</p>',
              type: 'theory',
              order: 1,
              estimatedDuration: 25,
              completed: false
            }
          ]
        })
        
        setQuizzes({
          '1': [
            {
              id: '1',
              moduleId: '1',
              title: 'Module 1 Quiz',
              description: 'Test your knowledge of basic concepts',
              type: 'practice',
              timeLimit: 10,
              passingScore: 70,
              maxAttempts: 3,
              completed: false,
              bestScore: 0
            }
          ],
          '2': [
            {
              id: '2',
              moduleId: '2',
              title: 'Threat Assessment',
              description: 'Evaluate your understanding of threats',
              type: 'practice',
              timeLimit: 15,
              passingScore: 80,
              maxAttempts: 2,
              completed: false,
              bestScore: 0
            }
          ]
        })
        
        // Mock progress
        setProgress({
          courseId,
          completedLessons: ['1'],
          completedQuizzes: [],
          overallProgress: 15,
          currentModule: '1',
          currentLesson: '2'
        })
      }

      // Fetch user progress
      await fetchUserProgress()
      
    } catch (error) {
      console.error('Error fetching course data:', error)
      showToast('Failed to load course data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchModuleLessons = async (moduleId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/learning/modules/${moduleId}/lessons`)
      if (response.ok) {
        const data = await response.json()
        console.log('Fetch lessons response:', data) // Debug log
        
        // Handle different response structures
        let lessonsData = []
        if (data.success && data.data && data.data.lessons && Array.isArray(data.data.lessons)) {
          lessonsData = data.data.lessons
        } else if (data.success && data.data && Array.isArray(data.data)) {
          lessonsData = data.data
        } else if (Array.isArray(data)) {
          lessonsData = data
        } else if (data.lessons && Array.isArray(data.lessons)) {
          lessonsData = data.lessons
        }
        
        setLessons(prev => ({ ...prev, [moduleId]: lessonsData }))
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
    }
  }

  const fetchModuleQuizzes = async (moduleId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/learning/modules/${moduleId}/quizzes`)
      if (response.ok) {
        const data = await response.json()
        console.log('Fetch quizzes response:', data) // Debug log
        
        // Handle different response structures
        let quizzesData = []
        if (data.success && data.data && data.data.quizzes && Array.isArray(data.data.quizzes)) {
          quizzesData = data.data.quizzes
        } else if (data.success && data.data && Array.isArray(data.data)) {
          quizzesData = data.data
        } else if (Array.isArray(data)) {
          quizzesData = data
        } else if (data.quizzes && Array.isArray(data.quizzes)) {
          quizzesData = data.quizzes
        }
        
        setQuizzes(prev => ({ ...prev, [moduleId]: quizzesData }))
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    }
  }

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/progress/course/${courseId}/user/${userId}`)
      if (response.ok) {
        const progressData = await response.json()
        setProgress(progressData.data)
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    }
  }

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  const startLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson)
    setCurrentView('lesson')
  }

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    setCurrentView('quiz')
  }

  const markLessonCompleted = async (lessonId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/progress/lesson/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        // Update local state
        if (progress) {
          setProgress({
            ...progress,
            completedLessons: [...progress.completedLessons, lessonId]
          })
        }
        
        // Mark lesson as completed in local state
        Object.keys(lessons).forEach(moduleId => {
          setLessons(prev => ({
            ...prev,
            [moduleId]: prev[moduleId].map(lesson => 
              lesson.id === lessonId ? { ...lesson, completed: true } : lesson
            )
          }))
        })
        
        showToast('Lesson completed!', 'success')
      }
    } catch (error) {
      console.error('Error marking lesson completed:', error)
      showToast('Failed to mark lesson as completed', 'error')
    }
  }

  const backToOverview = () => {
    setCurrentView('overview')
    setCurrentLesson(null)
    setCurrentQuiz(null)
  }

  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessons.includes(lessonId) || false
  }

  const isQuizCompleted = (quizId: string) => {
    return progress?.completedQuizzes.includes(quizId) || false
  }

  const isModuleCompleted = (moduleId: string) => {
    const moduleLessons = lessons[moduleId] || []
    const moduleQuizzes = quizzes[moduleId] || []
    
    const allLessonsCompleted = moduleLessons.every(lesson => isLessonCompleted(lesson.id))
    const allQuizzesCompleted = moduleQuizzes.every(quiz => isQuizCompleted(quiz.id))
    
    return allLessonsCompleted && allQuizzesCompleted
  }

  const getModuleProgress = (moduleId: string) => {
    const moduleLessons = lessons[moduleId] || []
    const moduleQuizzes = quizzes[moduleId] || []
    const totalItems = moduleLessons.length + moduleQuizzes.length
    
    if (totalItems === 0) return 0
    
    const completedLessons = moduleLessons.filter(lesson => isLessonCompleted(lesson.id)).length
    const completedQuizzes = moduleQuizzes.filter(quiz => isQuizCompleted(quiz.id)).length
    
    return Math.round(((completedLessons + completedQuizzes) / totalItems) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-harmony-dark flex items-center justify-center">
        <div className="text-white">Loading course...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-harmony-dark flex items-center justify-center">
        <div className="text-white">Course not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-harmony-dark">
      {/* Header */}
      <div className="bg-white/5 border-b border-harmony-cream/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">{course.title}</h1>
              <p className="text-harmony-cream/80">{course.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-harmony-cream/60">
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.estimatedDuration}m</span>
                </span>
                <span className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{course.enrolledUsers} enrolled</span>
                </span>
                <span className="flex items-center space-x-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>{progress?.overallProgress || 0}% completed</span>
                </span>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-harmony-cream hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar Navigation */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white/5 rounded-lg border border-harmony-cream/20 p-4 sticky top-8">
            <h3 className="text-white font-semibold mb-4">Course Progress</h3>
            
            {/* Overall Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-harmony-cream/80 text-sm">Overall Progress</span>
                <span className="text-white font-medium">{progress?.overallProgress || 0}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress?.overallProgress || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Module Navigation */}
            <div className="space-y-2">
              {modules.map((module, index) => {
                const moduleProgress = getModuleProgress(module.id)
                const isCompleted = isModuleCompleted(module.id)
                
                return (
                  <div key={module.id} className="border border-harmony-cream/20 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModuleExpansion(module.id)}
                      className="w-full p-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-left"
                    >
                      <div className="flex items-center space-x-3">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-harmony-cream/40" />
                        )}
                        <div>
                          <div className="text-white font-medium text-sm">
                            Module {index + 1}: {module.title}
                          </div>
                          <div className="text-harmony-cream/60 text-xs">
                            {moduleProgress}% complete
                          </div>
                        </div>
                      </div>
                      {expandedModules[module.id] ? 
                        <ChevronDown className="h-4 w-4 text-harmony-cream" /> : 
                        <ChevronRight className="h-4 w-4 text-harmony-cream" />
                      }
                    </button>

                    {expandedModules[module.id] && (
                      <div className="bg-white/5">
                        {/* Lessons */}
                        {lessons[module.id]?.map((lesson) => {
                          const completed = isLessonCompleted(lesson.id)
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => startLesson(lesson)}
                              className={`w-full p-3 border-t border-harmony-cream/10 hover:bg-white/10 transition-colors flex items-center space-x-3 text-left ${
                                currentLesson?.id === lesson.id ? 'bg-blue-600/20' : ''
                              }`}
                            >
                              {completed ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : (
                                <BookOpen className="h-4 w-4 text-blue-400" />
                              )}
                              <div className="flex-1">
                                <div className="text-white text-sm">{lesson.title}</div>
                                <div className="text-harmony-cream/60 text-xs">
                                  {lesson.estimatedDuration}m • {lesson.type}
                                </div>
                              </div>
                            </button>
                          )
                        })}

                        {/* Quizzes */}
                        {quizzes[module.id]?.map((quiz) => {
                          const completed = isQuizCompleted(quiz.id)
                          return (
                            <button
                              key={quiz.id}
                              onClick={() => startQuiz(quiz)}
                              className={`w-full p-3 border-t border-harmony-cream/10 hover:bg-white/10 transition-colors flex items-center space-x-3 text-left ${
                                currentQuiz?.id === quiz.id ? 'bg-purple-600/20' : ''
                              }`}
                            >
                              {completed ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : (
                                <Play className="h-4 w-4 text-purple-400" />
                              )}
                              <div className="flex-1">
                                <div className="text-white text-sm">Quiz: {quiz.title}</div>
                                <div className="text-harmony-cream/60 text-xs">
                                  {quiz.timeLimit}m • {quiz.passingScore}% to pass
                                  {completed && quiz.bestScore && (
                                    <span className="text-green-400"> • Best: {quiz.bestScore}%</span>
                                  )}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {currentView === 'overview' && (
            <div className="bg-white/5 rounded-lg border border-harmony-cream/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Welcome to {course.title}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-600/10 p-6 rounded-lg border border-blue-600/20">
                  <Clock className="h-8 w-8 text-blue-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Duration</h3>
                  <p className="text-blue-200">{course.estimatedDuration} minutes</p>
                </div>

                <div className="bg-green-600/10 p-6 rounded-lg border border-green-600/20">
                  <BookOpen className="h-8 w-8 text-green-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Modules</h3>
                  <p className="text-green-200">{modules.length} learning modules</p>
                </div>

                <div className="bg-purple-600/10 p-6 rounded-lg border border-purple-600/20">
                  <Award className="h-8 w-8 text-purple-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Certification</h3>
                  <p className="text-purple-200">Earn a completion certificate</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-white font-semibold mb-4">Your Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {modules.map((module, index) => {
                    const moduleProgress = getModuleProgress(module.id)
                    return (
                      <div key={module.id} className="bg-white/5 p-4 rounded-lg border border-harmony-cream/20">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white font-medium">Module {index + 1}</h4>
                          <span className="text-harmony-cream/60 text-sm">{moduleProgress}%</span>
                        </div>
                        <h5 className="text-harmony-cream/80 mb-2">{module.title}</h5>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${moduleProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="text-center">
                {progress?.currentLesson ? (
                  <button
                    onClick={() => {
                      // Find and start current lesson
                      Object.values(lessons).forEach(moduleLesson => {
                        const lesson = moduleLesson.find(l => l.id === progress.currentLesson)
                        if (lesson) startLesson(lesson)
                      })
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                  >
                    Continue Learning
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (modules.length > 0) {
                        setExpandedModules({ [modules[0].id]: true })
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                  >
                    Start Course
                  </button>
                )}
              </div>
            </div>
          )}

          {currentView === 'lesson' && currentLesson && (
            <div className="bg-white/5 rounded-lg border border-harmony-cream/20 overflow-hidden">
              <div className="p-6 border-b border-harmony-cream/20">
                <button
                  onClick={backToOverview}
                  className="text-harmony-cream hover:text-white mb-4 flex items-center space-x-2"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  <span>Back to Course</span>
                </button>
                <h2 className="text-xl font-bold text-white">{currentLesson.title}</h2>
                <p className="text-harmony-cream/80">{currentLesson.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-harmony-cream/60">
                  <span>Duration: {currentLesson.estimatedDuration}m</span>
                  <span>Type: {currentLesson.type}</span>
                  {isLessonCompleted(currentLesson.id) && (
                    <span className="text-green-400 flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Completed</span>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
                
                {!isLessonCompleted(currentLesson.id) && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => markLessonCompleted(currentLesson.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Mark as Complete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'quiz' && currentQuiz && (
            <div className="bg-white/5 rounded-lg border border-harmony-cream/20">
              <div className="p-6 border-b border-harmony-cream/20">
                <button
                  onClick={backToOverview}
                  className="text-harmony-cream hover:text-white mb-4 flex items-center space-x-2"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  <span>Back to Course</span>
                </button>
                <h2 className="text-xl font-bold text-white">{currentQuiz.title}</h2>
                <p className="text-harmony-cream/80">{currentQuiz.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-harmony-cream/60">
                  <span>Time Limit: {currentQuiz.timeLimit || 'No limit'}</span>
                  <span>Passing Score: {currentQuiz.passingScore}%</span>
                  <span>Max Attempts: {currentQuiz.maxAttempts || 'Unlimited'}</span>
                  {isQuizCompleted(currentQuiz.id) && currentQuiz.bestScore && (
                    <span className="text-green-400">Best Score: {currentQuiz.bestScore}%</span>
                  )}
                </div>
              </div>
              
              <div className="p-8 text-center">
                <Play className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ready to take the quiz?</h3>
                <p className="text-harmony-cream/80 mb-6">
                  Test your knowledge with this interactive assessment.
                </p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                  {isQuizCompleted(currentQuiz.id) ? 'Retake Quiz' : 'Start Quiz'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
