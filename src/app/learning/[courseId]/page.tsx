'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { progressService } from '@/services/progressService'
import { BookOpen, Clock, CheckCircle, Lock, Play, ChevronRight, Trophy, Users, Target, ArrowLeft } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  level: string
  estimatedDuration: number
  learningObjectives: string[]
  tags: string[]
  modules: Module[]
  userProgress?: {
    progressPercentage: number
    completedModules: number
    totalModules: number
  }
}

interface Module {
  id: string
  title: string
  description: string
  order: number
  estimatedDuration: number
  lessons: Lesson[]
  quiz?: Quiz
  quizzes?: Quiz[]
  userProgress?: {
    status: string
    progressPercentage: number
  }
}

interface Lesson {
  id: string
  title: string
  description: string
  type: string
  order: number
  estimatedDuration: number
  userProgress?: {
    status: string
    completedAt?: string
  }
}

interface Quiz {
  id: string
  title: string
  description: string
  type: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  questions: Question[]
  isUnlocked?: boolean
  unlockReason?: string
  requiredProgress?: number
  currentProgress?: number
}

interface Question {
  id: string
  text: string
  type: string
  points: number
  order: number
}

export default function CoursePage() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set())
  const [quizAttempts, setQuizAttempts] = useState<Map<string, any>>(new Map())
  const [retakeTimers, setRetakeTimers] = useState<Map<string, number>>(new Map())

  // Format time for display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const fetchCourse = async () => {
      console.log('🔍 Fetching course with ID:', courseId)
      try {
        const response = await fetch(`http://localhost:3001/api/courses/${courseId}`)
        console.log('📡 Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch course: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('📊 Response data:', data)
        
        if (data.success) {
          console.log('✅ Course data received:', data.course)
          
          // Fetch user progress for this course
          try {
            const progressResponse = await progressService.getCourseProgress(courseId as string)
            console.log('📈 Progress data received:', progressResponse.data)
            
            // Get all lessons and check individual progress for each
            const allLessons = data.course.modules.flatMap((module: any) => 
              module.lessons.map((lesson: any) => ({ ...lesson, moduleId: module.id }))
            )
            
            // Check progress for each lesson individually
            const lessonProgressPromises = allLessons.map(async (lesson: any) => {
              try {
                const lessonProgress = await progressService.getLessonProgress(lesson.id)
                return {
                  lessonId: lesson.id,
                  progress: lessonProgress.data
                }
              } catch (error) {
                console.log(`⚠️ Could not fetch progress for lesson ${lesson.id}:`, error)
                return {
                  lessonId: lesson.id,
                  progress: null
                }
              }
            })
            
            const lessonProgressResults = await Promise.all(lessonProgressPromises)
            const lessonProgressMap = lessonProgressResults.reduce((acc, { lessonId, progress }) => {
              acc[lessonId] = progress
              return acc
            }, {} as Record<string, any>)
            
            console.log('📚 Individual lesson progress:', lessonProgressMap)

            // Fetch completed quizzes and attempts
            try {
              const completedQuizzesResponse = await fetch('http://localhost:3001/api/progress/completed-quizzes', {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                  'Content-Type': 'application/json'
                }
              })
            
              if (completedQuizzesResponse.ok) {
                const completedData = await completedQuizzesResponse.json()
                if (completedData.success) {
                  const completedQuizIds = new Set<string>(
                    completedData.completedQuizzes
                      .map((quiz: any) => quiz.quizId || quiz.quiz?.id)
                      .filter((id: string) => id !== undefined && id !== null)
                  )
                  console.log('🎯 Completed quiz IDs:', completedQuizIds)
                  setCompletedQuizzes(completedQuizIds)
                  
                  // Store quiz attempts for detailed info
                  const attemptsMap = new Map<string, any>()
                  completedData.completedQuizzes.forEach((quiz: any) => {
                    const quizId = quiz.quizId || quiz.quiz?.id
                    if (quizId) {
                      attemptsMap.set(quizId, quiz)
                    }
                  })
                  setQuizAttempts(attemptsMap)
                }
              }
            } catch (error) {
              console.error('Error fetching completed quizzes:', error)
            }
            
            // Add progress data to course and lessons
            const courseWithProgress = {
              ...data.course,
              userProgress: {
                ...progressResponse.data,
                progressPercentage: progressResponse.data.overallProgress
              },
              modules: data.course.modules.map((module: any) => ({
                ...module,
                lessons: module.lessons.map((lesson: any) => ({
                  ...lesson,
                  userProgress: lessonProgressMap[lesson.id] || { status: 'not_started' }
                }))
              }))
            }
            
            // Add quiz data to modules (from course data)
            const courseWithQuizzes = {
              ...courseWithProgress,
              modules: courseWithProgress.modules.map((module: any) => ({
                ...module,
                quizzes: module.quiz ? [module.quiz] : []
              }))
            }
            
            setCourse(courseWithQuizzes)
            
            // Try to fetch unlock status for authenticated users
            const token = localStorage.getItem('token')
            if (token) {
              try {
                const quizzesResponse = await fetch(`http://localhost:3001/api/progress/course/${courseId}/quizzes`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                })
                
                if (quizzesResponse.ok) {
                  const quizzesData = await quizzesResponse.json()
                  console.log('🎯 Quizzes data received:', quizzesData.data)
                  
                  // Update quiz data with unlock status
                  const courseWithUnlockStatus = {
                    ...courseWithQuizzes,
                    modules: courseWithQuizzes.modules.map((module: any) => ({
                      ...module,
                      quizzes: [
                        ...quizzesData.data.unlocked.filter((q: any) => q.module_id === module.id),
                        ...quizzesData.data.locked.filter((q: any) => q.module_id === module.id)
                      ]
                    }))
                  }
                  
                  setCourse(courseWithUnlockStatus)
                }
              } catch (quizError) {
                console.log('⚠️ Could not fetch quiz unlock status, using basic quiz data:', quizError)
              }
            }
          } catch (progressError) {
            console.error('⚠️ Error fetching progress, using course without progress:', progressError)
            setCourse(data.course)
          }
          
          setLoading(false)
          console.log('🔄 Loading set to false, course set to:', data.course)
        } else {
          throw new Error(data.message || 'Failed to fetch course')
        }
      } catch (error) {
        console.error('❌ Error fetching course:', error)
        setCourse(null)
        setLoading(false)
        return
      }
    }

    fetchCourse()
  }, [courseId])

  // Timer for retake availability
  useEffect(() => {
    const updateRetakeTimers = () => {
      const now = Date.now()
      const newTimers = new Map<string, number>()
      
      quizAttempts.forEach((attempt, quizId) => {
        if (attempt.score < 100 && attempt.completedAt) {
          const completedTime = new Date(attempt.completedAt).getTime()
          const timeSinceCompletion = now - completedTime
          const retakeDelay = 15 * 60 * 1000 // 15 minutes in milliseconds
          const timeUntilRetake = Math.max(0, retakeDelay - timeSinceCompletion)
          
          if (timeUntilRetake > 0) {
            newTimers.set(quizId, Math.ceil(timeUntilRetake / 1000)) // Convert to seconds
          }
        }
      })
      
      setRetakeTimers(newTimers)
    }

    // Update timers immediately
    updateRetakeTimers()

    // Update timers every second
    const interval = setInterval(updateRetakeTimers, 1000)

    return () => clearInterval(interval)
  }, [quizAttempts])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-copper mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    console.log('❌ No course data - showing error state')
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-warm-copper" />
      case 'in_progress':
        return <Play className="w-5 h-5 text-warm-amber" />
      case 'locked':
        return <Lock className="w-5 h-5 text-warm-brass" />
      default:
        return <BookOpen className="w-5 h-5 text-warm-gray" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-warm-copper'
      case 'in_progress':
        return 'text-warm-amber'
      case 'locked':
        return 'text-warm-brass'
      default:
        return 'text-warm-gray'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-gray-600 hover:text-warm-copper transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-warm-copper to-warm-bronze rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-lg text-gray-600 mt-1">{course.description}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {Math.round(course.estimatedDuration / 60)} hours
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Trophy className="w-4 h-4 mr-1" />
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {course.userProgress?.completedModules || 0} of {course.userProgress?.totalModules || 0} modules
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Circle */}
            <div className="text-center">
              <div className="relative w-24 h-24 mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-gray-200 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                  <circle 
                    className="text-warm-copper stroke-current" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * (course.userProgress?.progressPercentage || 0)) / 100}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-warm-copper">
                    {course.userProgress?.progressPercentage || 0}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Complete</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Course Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Overview</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  This comprehensive course covers all the essential cybersecurity knowledge you need to protect yourself and your organization from digital threats.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What you'll learn:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {course.learningObjectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modules */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
              
              {course.modules.map((module, index) => (
                <div key={module.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-warm-copper to-warm-bronze rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{module.order}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{module.title}</h3>
                          <p className="text-gray-600">{module.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {Math.round(module.estimatedDuration / 60)} min
                        </div>
                        {getStatusIcon(module.userProgress?.status || 'not_started')}
                      </div>
                    </div>

                    {/* Lessons */}
                    <div className="space-y-3">
                      {module.lessons.map((lesson) => {
                        const isCompleted = lesson.userProgress?.status === 'completed';
                        return (
                          <div 
                            key={lesson.id} 
                            className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                              isCompleted 
                                ? 'bg-warm-copper/10 border border-warm-copper/20' 
                                : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(lesson.userProgress?.status || 'not_started')}
                              <div>
                                <h4 className={`font-medium ${isCompleted ? 'text-warm-copper' : 'text-gray-900'}`}>
                                  {lesson.title}
                                </h4>
                                <p className={`text-sm ${isCompleted ? 'text-warm-bronze' : 'text-gray-600'}`}>
                                  {lesson.description}
                                </p>
                                {isCompleted && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warm-copper text-white mt-1">
                                    ✓ Read
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs ${isCompleted ? 'text-warm-bronze' : 'text-gray-500'} capitalize`}>
                                {lesson.type}
                              </span>
                              <span className={`text-xs ${isCompleted ? 'text-warm-bronze' : 'text-gray-500'}`}>
                                {lesson.estimatedDuration} min
                              </span>
                              <button 
                                onClick={() => router.push(`/learning/${courseId}/lesson/${lesson.id}`)}
                                className={`transition-colors ${
                                  isCompleted 
                                    ? 'text-warm-copper hover:text-warm-bronze' 
                                    : 'text-warm-copper hover:text-warm-bronze'
                                }`}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Quizzes */}
                      {module.quizzes && module.quizzes.length > 0 && (
                        <div className="space-y-3">
                          {module.quizzes.map((quiz: Quiz, quizIndex: number) => (
                            <div 
                              key={quiz.id}
                              className={`flex items-center justify-between p-4 rounded-lg border ${
                                quiz.isUnlocked !== false
                                  ? 'bg-warm-copper/10 border-warm-copper/20' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                {quiz.isUnlocked !== false ? (
                                  <Target className="w-5 h-5 text-warm-copper" />
                                ) : (
                                  <Lock className="w-5 h-5 text-gray-400" />
                                )}
                                <div>
                                  <h4 className={`font-medium ${quiz.isUnlocked !== false ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {quiz.title}
                                  </h4>
                                  <p className={`text-sm ${quiz.isUnlocked !== false ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {quiz.description}
                                  </p>
                                  {quiz.isUnlocked === false && quiz.unlockReason && (
                                    <p className="text-xs text-amber-600 mt-1">
                                      🔒 {quiz.unlockReason}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs ${quiz.isUnlocked !== false ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {quiz.timeLimit} min
                                </span>
                                <span className={`text-xs ${quiz.isUnlocked !== false ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {quiz.passingScore}% to pass
                                </span>
                                {quiz.type === 'final_exam' && (
                                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                    🏆 Final Exam
                                  </span>
                                )}
                                {quiz.isUnlocked !== false ? (
                                  completedQuizzes.has(quiz.id) ? (
                                    <div className="flex flex-col space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          ✓ Quiz Completed
                                        </span>
                                        {quizAttempts.has(quiz.id) && (
                                          <span className="text-xs text-gray-600">
                                            Score: {quizAttempts.get(quiz.id)?.score || 0}%
                                          </span>
                                        )}
                                      </div>
                                      {quizAttempts.has(quiz.id) && quizAttempts.get(quiz.id)?.score === 100 ? (
                                        <div className="flex space-x-2">
                                          <button 
                                            onClick={() => router.push(`/learning/${courseId}/quiz/${quiz.id}?mode=review`)}
                                            className="px-3 py-1 rounded text-sm transition-colors bg-blue-600 text-white hover:bg-blue-700"
                                          >
                                            Review Quiz
                                          </button>
                                          <button 
                                            onClick={() => router.push(`/learning/${courseId}/quiz/${quiz.id}`)}
                                            className="px-3 py-1 rounded text-sm transition-colors bg-gray-600 text-white hover:bg-gray-700"
                                          >
                                            Retake Quiz
                                          </button>
                                        </div>
                                      ) : (
                                        retakeTimers.has(quiz.id) ? (
                                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            <span>Retake available in: {formatTime(retakeTimers.get(quiz.id)!)}</span>
                                          </div>
                                        ) : (
                                          <button 
                                            onClick={() => router.push(`/learning/${courseId}/quiz/${quiz.id}`)}
                                            className={`px-3 py-1 rounded text-sm transition-colors ${
                                              quiz.type === 'final_exam'
                                                ? 'bg-amber-600 text-white hover:bg-amber-700'
                                                : 'bg-warm-copper text-white hover:bg-warm-bronze'
                                            }`}
                                          >
                                            {quiz.type === 'final_exam' ? 'Start Final Exam' : 'Start Quiz'}
                                          </button>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => router.push(`/learning/${courseId}/quiz/${quiz.id}`)}
                                      className={`px-3 py-1 rounded text-sm transition-colors ${
                                        quiz.type === 'final_exam'
                                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                                          : 'bg-warm-copper text-white hover:bg-warm-bronze'
                                      }`}
                                    >
                                      {quiz.type === 'final_exam' ? 'Start Final Exam' : 'Start Quiz'}
                                    </button>
                                  )
                                ) : (
                                  <button 
                                    disabled
                                    className="bg-gray-300 text-gray-500 px-3 py-1 rounded text-sm cursor-not-allowed"
                                  >
                                    Locked
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Progress Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle className="text-gray-200 stroke-current" strokeWidth="6" cx="50" cy="50" r="40" fill="transparent"></circle>
                      <circle 
                        className="text-warm-copper stroke-current" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent" 
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 - (251.2 * (course.userProgress?.progressPercentage || 0)) / 100}
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-warm-copper">
                        {course.userProgress?.progressPercentage || 0}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {course.userProgress?.completedModules || 0} of {course.userProgress?.totalModules || 0} modules completed
                  </p>
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{Math.round(course.estimatedDuration / 60)} hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Level</span>
                    <span className="font-medium capitalize">{course.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Modules</span>
                    <span className="font-medium">{course.modules.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lessons</span>
                    <span className="font-medium">
                      {course.modules.reduce((total, module) => total + module.lessons.length, 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-warm-copper/10 text-warm-copper text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
