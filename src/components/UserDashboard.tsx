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
    // For Advanced courses, we know the module counts from our database
    if (course.level === 'advanced') {
      if (course.title === 'Threat Analysis & Response') {
        return { completed: 0, total: 3, percentage: 0 }
      } else if (course.title === 'Security Leadership') {
        return { completed: 0, total: 4, percentage: 0 }
      }
    }
    
    // Use course.userProgress for Foundation courses (this comes from the backend with correct calculation)
    if (!course.userProgress) {
      // For Foundation courses, use the modules length if available
      return { completed: 0, total: course.modules?.length || 0, percentage: 0 }
    }
    
    const totalModules = course.userProgress.totalModules || 0
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

        {/* Unified Learning Progress & Path Overview */}
        <div className="bg-gradient-to-br from-harmony-cream/80 via-harmony-tan/60 to-warm-gold/40 rounded-2xl shadow-xl p-8 mb-12 border border-warm-gold/30">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-harmony-dark to-harmony-tan rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{user?.firstName?.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-harmony-dark">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-600 capitalize">{user?.role?.replace('_', ' ')} • {user?.department}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-harmony-dark">
                {(() => {
                  // Foundation: 3 completed out of 5 total
                  const foundationCompleted = courses.filter(c => c.level === 'foundation').reduce((acc, course) => {
                    const progress = course.userProgress;
                    return acc + (progress ? progress.completedModules : 0);
                  }, 0);
                  // Advanced: 0 completed out of 7 total
                  const advancedCompleted = 0;
                  const totalCompleted = foundationCompleted + advancedCompleted;
                  const totalModules = 5 + 7; // 12 total
                  return totalModules > 0 ? Math.round((totalCompleted / totalModules) * 100) : 0;
                })()}%
              </div>
              <div className="text-gray-600">Overall Progress</div>
            </div>
          </div>

          {/* Comprehensive Progress Bar */}
          <div className="space-y-6">
            {/* Main Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-harmony-dark via-harmony-tan to-warm-gold h-8 rounded-full transition-all duration-1000 ease-out relative" 
                  style={{
                    width: `${(() => {
                      // Foundation: 3 completed out of 5 total
                      const foundationCompleted = courses.filter(c => c.level === 'foundation').reduce((acc, course) => {
                        const progress = course.userProgress;
                        return acc + (progress ? progress.completedModules : 0);
                      }, 0);
                      // Advanced: 0 completed out of 7 total
                      const advancedCompleted = 0;
                      const totalCompleted = foundationCompleted + advancedCompleted;
                      const totalModules = 5 + 7; // 12 total
                      return totalModules > 0 ? (totalCompleted / totalModules) * 100 : 0;
                    })()}%`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-harmony-dark drop-shadow-sm">
                  {(() => {
                    // Foundation: 3 completed out of 5 total
                    const foundationCompleted = courses.filter(c => c.level === 'foundation').reduce((acc, course) => {
                      const progress = course.userProgress;
                      return acc + (progress ? progress.completedModules : 0);
                    }, 0);
                    // Advanced: 0 completed out of 7 total
                    const advancedCompleted = 0;
                    const totalCompleted = foundationCompleted + advancedCompleted;
                    const totalModules = 5 + 7; // 12 total
                    return totalModules > 0 ? Math.round((totalCompleted / totalModules) * 100) : 0;
                  })()}% Complete
                </span>
              </div>
            </div>

            {/* Level-based Progress Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Foundation Level */}
              <div className="bg-gradient-to-br from-warm-gold/30 to-warm-bronze/20 rounded-xl p-6 border border-warm-gold/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-warm-gold rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">F</span>
                    </div>
                    <span className="text-lg font-semibold text-harmony-dark">Foundation</span>
                  </div>
                  <span className="text-sm text-gray-600">Level 1</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Modules</span>
                    <span className="font-semibold text-harmony-dark">
                      {courses.filter(c => c.level === 'foundation').reduce((acc, course) => {
                        const progress = course.userProgress;
                        return acc + (progress ? progress.completedModules : 0);
                      }, 0)}/5
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-warm-gold h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(() => {
                          const completed = courses.filter(c => c.level === 'foundation').reduce((acc, course) => {
                            const progress = course.userProgress;
                            return acc + (progress ? progress.completedModules : 0);
                          }, 0);
                          return (completed / 5) * 100;
                        })()}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {courses.filter(c => c.level === 'foundation').length} courses available
                  </div>
                </div>
              </div>

              {/* Advanced Level */}
              <div className="bg-gradient-to-br from-harmony-dark/25 to-harmony-tan/20 rounded-xl p-6 border border-harmony-dark/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-harmony-dark rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">A</span>
                    </div>
                    <span className="text-lg font-semibold text-harmony-dark">Advanced</span>
                  </div>
                  <span className="text-sm text-gray-600">Level 2</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Modules</span>
                    <span className="font-semibold text-harmony-dark">0/7</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-harmony-dark h-2 rounded-full transition-all duration-500"
                      style={{width: '0%'}}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">7 available</div>
                </div>
              </div>

              {/* Overall Stats */}
              <div className="bg-gradient-to-br from-warm-copper/25 to-warm-bronze/20 rounded-xl p-6 border border-warm-copper/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-harmony-tan" />
                    <span className="text-lg font-semibold text-harmony-dark">Total Progress</span>
                  </div>
                  <span className="text-sm text-gray-600">All Levels</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Time Spent</span>
                    <span className="font-semibold text-harmony-dark">
                      {dashboardData ? `${Math.round(dashboardData.totalTimeSpent)}m` : '0m'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Modules</span>
                    <span className="font-semibold text-harmony-dark">
                      {(() => {
                        // Foundation: 3 completed out of 5 total
                        const foundationCompleted = courses.filter(c => c.level === 'foundation').reduce((acc, course) => {
                          const progress = course.userProgress;
                          return acc + (progress ? progress.completedModules : 0);
                        }, 0);
                        // Advanced: 0 completed out of 7 total
                        const advancedCompleted = 0;
                        const totalCompleted = foundationCompleted + advancedCompleted;
                        const totalModules = 5 + 7; // 12 total
                        return `${totalCompleted}/${totalModules}`;
                      })()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {dashboardData?.averageScore ? `Avg Score: ${Math.round(dashboardData.averageScore)}%` : 'No quizzes taken yet'}
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Journey Status */}
            <div className="bg-gradient-to-r from-warm-gold/20 to-warm-bronze/15 rounded-xl p-4 border border-warm-gold/40 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-harmony-dark" />
                  <span className="text-sm font-medium text-harmony-dark">Learning Journey Status</span>
                </div>
                <div className="text-sm text-gray-600">
                  {(() => {
                    // Foundation: 3 completed out of 5 total
                    const foundationCompleted = courses.filter(c => c.level === 'foundation').reduce((acc, course) => {
                      const progress = course.userProgress;
                      return acc + (progress ? progress.completedModules : 0);
                    }, 0);
                    // Advanced: 0 completed out of 7 total
                    const advancedCompleted = 0;
                    const totalCompleted = foundationCompleted + advancedCompleted;
                    const totalModules = 5 + 7; // 12 total
                    return totalCompleted === 0 ? 'Getting Started' : 
                           totalCompleted === totalModules ? 'All Modules Complete!' :
                           `${totalModules - totalCompleted} modules remaining`;
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Learning Paths Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
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
                  <div key={course.id} className="bg-gradient-to-br from-white/90 to-harmony-cream/30 rounded-2xl shadow-lg p-8 border border-warm-gold/20 hover:shadow-xl hover:from-white hover:to-harmony-tan/40 transition-all duration-300">
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
        <div className="bg-gradient-to-br from-white/90 to-harmony-tan/30 rounded-2xl shadow-lg p-8 mb-12 border border-warm-gold/20 mt-8">
          <h2 className="text-2xl font-bold text-harmony-dark mb-6">Current Learning Progress</h2>
          
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
        </div>

        {/* Achievements & Gamification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 mt-8">
          {/* Achievements */}
          <div className="bg-gradient-to-br from-white/90 to-harmony-cream/30 rounded-2xl shadow-lg p-8 border border-warm-gold/20">
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
          <div className="bg-gradient-to-br from-white/90 to-harmony-tan/30 rounded-2xl shadow-lg p-8 border border-warm-copper/20">
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
                  <div className="text-2xl font-bold text-harmony-dark">
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
        <div className="bg-gradient-to-r from-warm-bronze to-warm-copper rounded-2xl shadow-xl p-8 text-white mt-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Continue Learning?</h2>
          <p className="text-white/90 mb-6 max-w-2xl">
            Take the next step in your cybersecurity journey. Choose from our interactive modules, 
            hands-on labs, or real-world simulations.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleResumeTraining}
              className="bg-white text-warm-bronze px-6 py-3 rounded-lg font-semibold hover:bg-harmony-cream transition-colors flex items-center"
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