'use client'

import { useState, useEffect } from 'react'
import { X, Play, BookOpen, Clock, Users, Award, ChevronRight, ChevronDown } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Course {
  id: string
  title: string
  description: string
  level: string
  status: string
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
}

interface CoursePreviewProps {
  course: Course
  onClose: () => void
}

export default function CoursePreview({ course, onClose }: CoursePreviewProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<{ [moduleId: string]: Lesson[] }>({})
  const [quizzes, setQuizzes] = useState<{ [moduleId: string]: Quiz[] }>({})
  const [expandedModules, setExpandedModules] = useState<{ [moduleId: string]: boolean }>({})
  const [currentView, setCurrentView] = useState<'overview' | 'lesson' | 'quiz'>('overview')
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourseContent()
  }, [course.id])

  const fetchCourseContent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/learning/courses/${course.id}/modules`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('CoursePreview API Response:', data)
        
        // Handle different response structures
        let modulesData = []
        if (data.success && data.data && Array.isArray(data.data)) {
          modulesData = data.data
        } else if (data.success && data.data && data.data.modules && Array.isArray(data.data.modules)) {
          modulesData = data.data.modules
        } else if (Array.isArray(data)) {
          modulesData = data
        } else if (data.modules && Array.isArray(data.modules)) {
          modulesData = data.modules
        }
        
        setModules(modulesData)
        
        // Fetch lessons and quizzes for each module - ensure modulesData is array
        if (Array.isArray(modulesData)) {
          for (const module of modulesData) {
            if (module && module.id) {
              await fetchModuleLessons(module.id)
              await fetchModuleQuizzes(module.id)
            }
          }
        }
      } else {
        // Mock data for development
        const mockModules: Module[] = [
          {
            id: '1',
            courseId: course.id,
            title: 'Introduction to Cybersecurity',
            description: 'Basic concepts and terminology',
            order: 1,
            estimatedDuration: 120,
            isActive: true
          }
        ]
        setModules(mockModules)
        
        // Mock lessons
        setLessons({
          '1': [
            {
              id: '1',
              moduleId: '1',
              title: 'What is Cybersecurity?',
              description: 'Understanding the fundamentals',
              content: '<h2>Introduction to Cybersecurity</h2><p>Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks...</p>',
              type: 'theory',
              order: 1,
              estimatedDuration: 15
            }
          ]
        })
        
        // Mock quizzes
        setQuizzes({
          '1': [
            {
              id: '1',
              moduleId: '1',
              title: 'Knowledge Check',
              description: 'Test your understanding of basic concepts',
              type: 'practice',
              timeLimit: 10,
              passingScore: 70,
              maxAttempts: 3
            }
          ]
        })
      }
    } catch (error) {
      console.error('Error fetching course content:', error)
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

  const backToOverview = () => {
    setCurrentView('overview')
    setCurrentLesson(null)
    setCurrentQuiz(null)
  }

  const calculateTotalDuration = () => {
    return modules.reduce((total, module) => total + module.estimatedDuration, 0)
  }

  const getTotalLessons = () => {
    return Object.values(lessons).reduce((total, moduleLesson) => total + moduleLesson.length, 0)
  }

  const getTotalQuizzes = () => {
    return Object.values(quizzes).reduce((total, moduleQuiz) => total + moduleQuiz.length, 0)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-harmony-dark rounded-lg p-6 border border-harmony-cream/20">
          <div className="text-white">Loading course preview...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-harmony-dark rounded-lg w-full max-w-7xl max-h-[95vh] overflow-y-auto border border-harmony-cream/20 flex">
        
        {/* Sidebar Navigation */}
        <div className="w-80 border-r border-harmony-cream/20 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-harmony-cream/20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">{course.title}</h3>
              <button
                onClick={onClose}
                className="text-harmony-cream hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/5 p-2 rounded">
                <div className="text-harmony-cream/60">Duration</div>
                <div className="text-white font-medium">{course.estimatedDuration || calculateTotalDuration()}m</div>
              </div>
              <div className="bg-white/5 p-2 rounded">
                <div className="text-harmony-cream/60">Level</div>
                <div className="text-white font-medium capitalize">{course.level}</div>
              </div>
              <div className="bg-white/5 p-2 rounded">
                <div className="text-harmony-cream/60">Lessons</div>
                <div className="text-white font-medium">{getTotalLessons()}</div>
              </div>
              <div className="bg-white/5 p-2 rounded">
                <div className="text-harmony-cream/60">Quizzes</div>
                <div className="text-white font-medium">{getTotalQuizzes()}</div>
              </div>
            </div>
          </div>

          {/* Course Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {modules.map((module, index) => (
                <div key={module.id} className="border border-harmony-cream/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleModuleExpansion(module.id)}
                    className="w-full p-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-left"
                  >
                    <div>
                      <div className="text-white font-medium text-sm">
                        Module {index + 1}: {module.title}
                      </div>
                      <div className="text-harmony-cream/60 text-xs">
                        {module.estimatedDuration}m • {(lessons[module.id] || []).length} lessons
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
                      {lessons[module.id]?.map((lesson, lessonIndex) => (
                        <button
                          key={lesson.id}
                          onClick={() => startLesson(lesson)}
                          className={`w-full p-3 border-t border-harmony-cream/10 hover:bg-white/10 transition-colors flex items-center space-x-3 text-left ${
                            currentLesson?.id === lesson.id ? 'bg-blue-600/20' : ''
                          }`}
                        >
                          <BookOpen className="h-4 w-4 text-green-400" />
                          <div className="flex-1">
                            <div className="text-white text-sm">{lesson.title}</div>
                            <div className="text-harmony-cream/60 text-xs">
                              {lesson.estimatedDuration}m • {lesson.type}
                            </div>
                          </div>
                        </button>
                      ))}

                      {/* Quizzes */}
                      {quizzes[module.id]?.map((quiz) => (
                        <button
                          key={quiz.id}
                          onClick={() => startQuiz(quiz)}
                          className={`w-full p-3 border-t border-harmony-cream/10 hover:bg-white/10 transition-colors flex items-center space-x-3 text-left ${
                            currentQuiz?.id === quiz.id ? 'bg-purple-600/20' : ''
                          }`}
                        >
                          <Play className="h-4 w-4 text-purple-400" />
                          <div className="flex-1">
                            <div className="text-white text-sm">Quiz: {quiz.title}</div>
                            <div className="text-harmony-cream/60 text-xs">
                              {quiz.timeLimit}m • {quiz.passingScore}% to pass
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {currentView === 'overview' && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Course Overview</h2>
                <p className="text-harmony-cream/80 text-lg leading-relaxed">{course.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-600/10 p-6 rounded-lg border border-blue-600/20">
                  <Clock className="h-8 w-8 text-blue-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Total Duration</h3>
                  <p className="text-blue-200">{calculateTotalDuration()} minutes of content</p>
                </div>

                <div className="bg-green-600/10 p-6 rounded-lg border border-green-600/20">
                  <BookOpen className="h-8 w-8 text-green-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Learning Materials</h3>
                  <p className="text-green-200">{getTotalLessons()} lessons across {modules.length} modules</p>
                </div>

                <div className="bg-purple-600/10 p-6 rounded-lg border border-purple-600/20">
                  <Award className="h-8 w-8 text-purple-400 mb-3" />
                  <h3 className="text-white font-semibold mb-2">Assessments</h3>
                  <p className="text-purple-200">{getTotalQuizzes()} interactive quizzes</p>
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-lg border border-harmony-cream/20">
                <h3 className="text-white font-semibold mb-4">Course Structure</h3>
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <div key={module.id} className="border border-harmony-cream/20 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">
                        Module {index + 1}: {module.title}
                      </h4>
                      <p className="text-harmony-cream/80 text-sm mb-3">{module.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-harmony-cream/60">
                        <span>{module.estimatedDuration} minutes</span>
                        <span>{(lessons[module.id] || []).length} lessons</span>
                        <span>{(quizzes[module.id] || []).length} quizzes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    if (modules.length > 0 && modules[0]) {
                      setExpandedModules({ [modules[0].id]: true })
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                >
                  Start Course
                </button>
              </div>
            </div>
          )}

          {currentView === 'lesson' && currentLesson && (
            <div className="flex-1 flex flex-col">
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
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              </div>
            </div>
          )}

          {currentView === 'quiz' && currentQuiz && (
            <div className="flex-1 flex flex-col">
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
                </div>
              </div>
              
              <div className="flex-1 p-6 flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Quiz Preview</h3>
                  <p className="text-harmony-cream/80 mb-6">
                    This is a preview mode. In the actual course, students would see the quiz questions here.
                  </p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg">
                    Start Quiz (Preview Mode)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
