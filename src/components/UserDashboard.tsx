'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import DashboardHeader from './DashboardHeader'
import { BookOpen, Trophy, Clock, Star, ChevronRight, Play, CheckCircle, Lock, Users, Target, Zap, BarChart3 } from 'lucide-react'
import CyberShield from './icons/CyberShield'
import PhishingHook from './icons/PhishingHook'
import SecurityLock from './icons/SecurityLock'
import NetworkSecurity from './icons/NetworkSecurity'
import ThreatDetection from './icons/ThreatDetection'
import CyberTraining from './icons/CyberTraining'
import { courseService } from '@/services/courseService'
import { progressService } from '@/services/progressService'
import { userDashboardService, UserDashboardData } from '@/services/userDashboardService'
import { Course } from '@/types/course'

export default function UserDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data, user:', user)
        // First fetch courses (no auth required)
        const coursesData = await courseService.getCourses()
        console.log('Courses fetched:', coursesData)
        setCourses(coursesData)
        
        // Only fetch dashboard data if user is authenticated
        if (user) {
          try {
            const dashboardData = await userDashboardService.getUserDashboardData()
            setDashboardData(dashboardData)
            
            // Fetch progress for each course
            const coursesWithProgress = await Promise.all(
              coursesData.map(async (course) => {
                try {
                  const progressResponse = await progressService.getCourseProgress(course.id)
                  return {
                    ...course,
                    userProgress: progressResponse.data
                  }
                } catch (error) {
                  console.error(`Error fetching progress for course ${course.id}:`, error)
                  return course
                }
              })
            )
            setCourses(coursesWithProgress)
          } catch (error) {
            console.error('Error fetching dashboard data:', error)
            // Set default dashboard data for unauthenticated users
            setDashboardData({
              overallProgress: 0,
              completedLessons: 0,
              totalLessons: 0,
              completedModules: 0,
              totalModules: 0,
              completedQuizzes: [],
              recentActivity: [],
              totalTimeSpent: 0,
              averageScore: 0,
              lastActivity: null
            })
          }
        } else {
          // Set default dashboard data for unauthenticated users
          setDashboardData({
            overallProgress: 0,
            completedLessons: 0,
            totalLessons: 0,
            completedModules: 0,
            totalModules: 0,
            completedQuizzes: [],
            recentActivity: [],
            totalTimeSpent: 0,
            averageScore: 0,
            lastActivity: null
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleCourseClick = (courseId: string) => {
    router.push(`/learning/${courseId}`)
  }

  const handleResumeTraining = () => {
    console.log('Resume Training clicked, courses:', courses)
    // Find foundation course and redirect to first lesson
    const foundationCourse = courses.find(course => course.level === 'foundation')
    console.log('Foundation course found:', foundationCourse)
    if (foundationCourse) {
      router.push(`/learning/${foundationCourse.id}`)
    } else {
      console.log('No foundation course found')
    }
  }

  const getCourseIcon = (level: string) => {
    switch (level) {
      case 'foundation':
        return <CyberShield className="w-8 h-8 text-warm-gold" />
      case 'advanced':
        return <ThreatDetection className="w-8 h-8 text-warm-gold" />
      default:
        return <CyberTraining className="w-8 h-8 text-warm-gold" />
    }
  }

  const getCourseStatus = (level: string) => {
    switch (level) {
      case 'foundation':
        return { text: 'Available', color: 'text-green-600', bg: 'bg-green-100' }
      case 'advanced':
        return { text: 'Locked', color: 'text-gray-500', bg: 'bg-gray-100' }
      default:
        return { text: 'Locked', color: 'text-gray-500', bg: 'bg-gray-100' }
    }
  }

  const getModuleProgress = (course: Course) => {
    // For foundation course, use dashboardData if available
    if (course.level === 'foundation' && dashboardData) {
      return { 
        completed: dashboardData.completedModules, 
        total: dashboardData.totalModules, 
        percentage: dashboardData.totalModules > 0 ? Math.round((dashboardData.completedModules / dashboardData.totalModules) * 100) : 0 
      }
    }
    
    // For other courses, use course.userProgress or default
    if (!course.userProgress) {
      return { completed: 0, total: course.modules?.length || 0, percentage: 0 }
    }
    
    const totalModules = course.modules?.length || 0
    const completedModules = course.userProgress.completedModules || 0
    const percentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
    
    return { completed: completedModules, total: totalModules, percentage }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan">
      {/* Header */}
      <DashboardHeader onMenuClick={() => {}} />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-harmony-dark rounded-full mb-6">
            <CyberShield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-harmony-dark mb-4">
            Cybersecurity Training Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome back, {user?.firstName}! Master cybersecurity skills through interactive training, 
            real-world simulations, and hands-on exercises. Your journey to becoming security-aware starts here.
          </p>
        </div>

        {/* User Progress Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{user?.firstName?.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-600 capitalize">{user?.role?.replace('_', ' ')} • {user?.department}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-harmony-dark">
                {dashboardData ? `${dashboardData.overallProgress}%` : '0%'}
              </div>
              <div className="text-gray-600">Overall Progress</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-gradient-to-r from-harmony-dark to-green-600 h-4 rounded-full transition-all duration-500" 
              style={{width: `${dashboardData?.overallProgress || 0}%`}}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              {dashboardData ? `${dashboardData.completedModules} of ${dashboardData.totalModules} modules completed` : '0 of 0 modules completed'}
            </span>
            <span>
              {dashboardData ? `${dashboardData.totalModules - dashboardData.completedModules} modules remaining` : '0 modules remaining'}
            </span>
          </div>
        </div>

        {/* Learning Paths Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-harmony-dark mb-4">Choose Your Learning Path</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Select a specialized track based on your role and experience level. Each path is designed to build practical cybersecurity skills.
          </p>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-harmony-dark mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading courses...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => {
                const status = getCourseStatus(course.level)
                const isLocked = course.level !== 'foundation'
                
                return (
                  <div key={course.id} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-warm-copper to-warm-bronze rounded-xl flex items-center justify-center">
                        {getCourseIcon(course.level)}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 uppercase">{course.level}</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {getModuleProgress(course).completed}/{getModuleProgress(course).total} Modules
                        </div>
                        <div className="text-xs text-gray-500">
                          {getModuleProgress(course).percentage}% Complete
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>
                    <p className="text-gray-600 mb-6">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.estimatedDuration} min</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${status.bg} ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleCourseClick(course.id)}
                        className={`px-6 py-2 rounded-lg transition-colors flex items-center ${
                          isLocked 
                            ? 'bg-gray-200 text-gray-700 cursor-not-allowed' 
                            : 'bg-harmony-dark text-white hover:bg-harmony-dark/90'
                        }`}
                        disabled={isLocked}
                      >
                        {isLocked ? (
                          <>
                            Locked
                            <Lock className="w-4 h-4 ml-1" />
                          </>
                        ) : (
                          <>
                            Continue
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Current Learning Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Learning Progress</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-harmony-dark mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading progress...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((course, index) => {
                const progress = getModuleProgress(course)
                const isCompleted = progress.percentage === 100
                const isInProgress = progress.percentage > 0 && progress.percentage < 100
                const isLocked = progress.percentage === 0 && index > 0
                
                const getStatusColor = () => {
                  if (isCompleted) return 'warm-copper'
                  if (isInProgress) return 'warm-amber'
                  if (isLocked) return 'warm-brass'
                  return 'gray-400'
                }
                
                const getStatusText = () => {
                  if (isCompleted) return 'Completed'
                  if (isInProgress) return 'In Progress'
                  if (isLocked) return 'Locked'
                  return 'Not Started'
                }
                
                const getStatusSubtext = () => {
                  if (isCompleted) return '100%'
                  if (isInProgress) return `${progress.percentage}%`
                  if (isLocked) return 'Complete previous course'
                  return 'Start learning'
                }
                
                const colorClass = getStatusColor()
                
                return (
                  <div 
                    key={course.id}
                    className={`flex items-center justify-between p-6 bg-gradient-to-r from-${colorClass}/10 to-${colorClass}/20 rounded-xl border border-${colorClass}/30`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-${colorClass} rounded-full flex items-center justify-center`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : isInProgress ? (
                          <Play className="w-6 h-6 text-white" />
                        ) : isLocked ? (
                          <Lock className="w-6 h-6 text-white" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <p className="text-gray-600 text-sm">{course.description}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {progress.completed}/{progress.total} modules • {course.estimatedDuration} min
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-${colorClass} font-semibold`}>{getStatusText()}</div>
                      <div className="text-sm text-gray-500">{getStatusSubtext()}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Achievements & Gamification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Achievements</h2>
            <div className="space-y-4">
              {dashboardData?.completedQuizzes && dashboardData.completedQuizzes.length > 0 ? (
                dashboardData.completedQuizzes.slice(0, 3).map((quiz, index) => (
                  <div key={quiz.id} className="flex items-center space-x-4 p-4 bg-warm-gold/10 rounded-lg border border-warm-gold/30">
                    <Trophy className="w-8 h-8 text-warm-gold" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {quiz.score === 100 ? 'Perfect Score!' : 'Quiz Completed'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {quiz.quiz?.title || 'Security Quiz'} - {quiz.score}% score
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(quiz.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Complete your first quiz to unlock achievements!</p>
                </div>
              )}
            </div>
          </div>

          {/* Learning Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Stats</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-warm-gold/10 to-warm-gold/20 rounded-lg border border-warm-gold/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warm-gold rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Average Score</h3>
                    <p className="text-gray-600 text-sm">Across all quizzes</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-warm-gold">
                    {Math.round(dashboardData?.averageScore || 0)}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-warm-brass/10 to-warm-brass/20 rounded-lg border border-warm-brass/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warm-brass rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Time Spent</h3>
                    <p className="text-gray-600 text-sm">Total learning time</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-warm-brass">
                    {dashboardData ? Math.round(dashboardData.totalTimeSpent) : 0}m
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-warm-bronze/10 to-warm-bronze/20 rounded-lg border border-warm-bronze/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warm-bronze rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quizzes Completed</h3>
                    <p className="text-gray-600 text-sm">Total attempts</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-warm-bronze">
                    {dashboardData?.completedQuizzes?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-harmony-dark to-green-700 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Continue Learning?</h2>
          <p className="text-harmony-cream mb-6 max-w-2xl">
            Take the next step in your cybersecurity journey. Choose from our interactive modules, 
            hands-on labs, or real-world simulations.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleResumeTraining}
              className="bg-white text-harmony-dark px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
            >
              <CyberTraining className="w-5 h-5 mr-2" />
              Resume Training
            </button>
            <button 
              onClick={() => router.push('/simulations')}
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center"
            >
              <PhishingHook className="w-5 h-5 mr-2" />
              Take Simulation
            </button>
            <button 
              onClick={() => router.push('/dashboard/personal')}
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              My Progress
            </button>
            <button 
              onClick={() => {
                const foundationCourse = courses.find(course => course.level === 'foundation')
                if (foundationCourse) {
                  handleCourseClick(foundationCourse.id)
                }
              }}
              className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Modules
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}