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
import { Course } from '@/types/course'

export default function UserDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await courseService.getCourses()
        
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
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleCourseClick = (courseId: string) => {
    router.push(`/learning/${courseId}`)
  }

  const handleResumeTraining = () => {
    // Find foundation course and redirect to first lesson
    const foundationCourse = courses.find(course => course.level === 'foundation')
    if (foundationCourse) {
      router.push(`/learning/${foundationCourse.id}`)
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
              <div className="text-3xl font-bold text-harmony-dark">87%</div>
              <div className="text-gray-600">Overall Progress</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div className="bg-gradient-to-r from-harmony-dark to-green-600 h-4 rounded-full" style={{width: '87%'}}></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>8 of 12 modules completed</span>
            <span>4 modules remaining</span>
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
                          {course.modules?.length || 0} Modules
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
          
          <div className="space-y-6">
            {/* Module 1 */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-warm-copper/10 to-warm-copper/20 rounded-xl border border-warm-copper/30">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-warm-copper rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Introduction to Cybersecurity</h3>
                  <p className="text-gray-600 text-sm">Understanding threats and security fundamentals</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-warm-copper font-semibold">Completed</div>
                <div className="text-sm text-gray-500">100%</div>
              </div>
            </div>

            {/* Module 2 */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-warm-amber/10 to-warm-amber/20 rounded-xl border border-warm-amber/30">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-warm-amber rounded-full flex items-center justify-center">
                  <PhishingHook className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phishing Awareness & Prevention</h3>
                  <p className="text-gray-600 text-sm">Recognizing and avoiding phishing attacks</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-warm-amber font-semibold">In Progress</div>
                <div className="text-sm text-gray-500">65%</div>
              </div>
            </div>

            {/* Module 3 */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-warm-brass/10 to-warm-brass/20 rounded-xl border border-warm-brass/30">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-warm-brass rounded-full flex items-center justify-center">
                  <SecurityLock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Password Security & MFA</h3>
                  <p className="text-gray-600 text-sm">Creating strong passwords and using multi-factor authentication</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-warm-brass font-semibold">Locked</div>
                <div className="text-sm text-gray-500">Complete previous module</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements & Gamification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Achievements</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-warm-gold/10 rounded-lg border border-warm-gold/30">
                <Trophy className="w-8 h-8 text-warm-gold" />
                <div>
                  <h3 className="font-semibold text-gray-900">First Quiz Master</h3>
                  <p className="text-gray-600 text-sm">Scored 100% on your first security quiz</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-warm-honey/10 rounded-lg border border-warm-honey/30">
                <Star className="w-8 h-8 text-warm-honey" />
                <div>
                  <h3 className="font-semibold text-gray-900">Consistent Learner</h3>
                  <p className="text-gray-600 text-sm">Completed 5 consecutive days of training</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-warm-sunset/10 rounded-lg border border-warm-sunset/30">
                <Zap className="w-8 h-8 text-warm-sunset" />
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Learner</h3>
                  <p className="text-gray-600 text-sm">Finished a module in record time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Leaderboard</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-warm-gold/10 to-warm-gold/20 rounded-lg border border-warm-gold/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warm-gold rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
                    <p className="text-gray-600 text-sm">IT Department</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-warm-gold">2,450</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-warm-brass/10 to-warm-brass/20 rounded-lg border border-warm-brass/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warm-brass rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mike Chen</h3>
                    <p className="text-gray-600 text-sm">Finance Department</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-warm-brass">2,180</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-warm-bronze/10 to-warm-bronze/20 rounded-lg border border-warm-bronze/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warm-bronze rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">You</h3>
                    <p className="text-gray-600 text-sm">{user?.department} Department</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-warm-bronze">1,920</div>
                  <div className="text-sm text-gray-500">points</div>
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