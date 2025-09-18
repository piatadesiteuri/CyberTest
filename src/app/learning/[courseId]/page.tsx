'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { BookOpen, Clock, CheckCircle, Lock, Play, ChevronRight, Trophy, Users, Target } from 'lucide-react'

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

  useEffect(() => {
    // TODO: Replace with actual API call
    // For now, using mock data inspired by The Odin Project structure
    const mockCourse: Course = {
      id: courseId as string,
      title: 'Cybersecurity Fundamentals',
      description: 'Master the basics of cybersecurity, threat awareness, and security best practices. Perfect for all employees regardless of technical background.',
      level: 'foundation',
      estimatedDuration: 600,
      learningObjectives: [
        'Understand basic cybersecurity concepts and terminology',
        'Identify common cyber threats and attack vectors',
        'Learn fundamental security principles and best practices',
        'Recognize phishing attempts and social engineering tactics',
        'Implement basic password security measures'
      ],
      tags: ['foundation', 'cybersecurity', 'basics', 'awareness'],
      modules: [
        {
          id: '1',
          title: 'Introduction to Cybersecurity',
          description: 'Understanding threats and security fundamentals',
          order: 1,
          estimatedDuration: 120,
          lessons: [
            {
              id: '1-1',
              title: 'What is Cybersecurity?',
              description: 'Introduction to cybersecurity concepts and importance',
              type: 'theory',
              order: 1,
              estimatedDuration: 30,
              userProgress: { status: 'completed', completedAt: '2024-01-15' }
            },
            {
              id: '1-2',
              title: 'Types of Cyber Threats',
              description: 'Understanding different categories of cyber threats',
              type: 'theory',
              order: 2,
              estimatedDuration: 45,
              userProgress: { status: 'completed', completedAt: '2024-01-15' }
            },
            {
              id: '1-3',
              title: 'Security Best Practices',
              description: 'Fundamental security practices everyone should follow',
              type: 'practical',
              order: 3,
              estimatedDuration: 45,
              userProgress: { status: 'in_progress' }
            }
          ],
          quiz: {
            id: 'quiz-1',
            title: 'Cybersecurity Fundamentals Quiz',
            description: 'Test your understanding of basic cybersecurity concepts',
            type: 'post_assessment',
            timeLimit: 15,
            passingScore: 70,
            maxAttempts: 3,
            questions: [
              {
                id: 'q1',
                text: 'What does the "C" in the CIA Triad stand for?',
                type: 'single_choice',
                points: 10,
                order: 1
              },
              {
                id: 'q2',
                text: 'Which of the following is NOT a type of malware?',
                type: 'single_choice',
                points: 10,
                order: 2
              },
              {
                id: 'q3',
                text: 'Phishing is a type of social engineering attack.',
                type: 'true_false',
                points: 10,
                order: 3
              }
            ]
          },
          userProgress: { status: 'completed', progressPercentage: 100 }
        },
        {
          id: '2',
          title: 'Phishing Awareness & Prevention',
          description: 'Recognizing and avoiding phishing attacks',
          order: 2,
          estimatedDuration: 90,
          lessons: [
            {
              id: '2-1',
              title: 'Recognizing Phishing Emails',
              description: 'How to identify suspicious emails and messages',
              type: 'interactive',
              order: 1,
              estimatedDuration: 30,
              userProgress: { status: 'not_started' }
            },
            {
              id: '2-2',
              title: 'Phishing Simulation Exercise',
              description: 'Practice identifying phishing attempts',
              type: 'practical',
              order: 2,
              estimatedDuration: 30,
              userProgress: { status: 'not_started' }
            },
            {
              id: '2-3',
              title: 'Reporting Suspicious Activity',
              description: 'What to do when you encounter phishing attempts',
              type: 'theory',
              order: 3,
              estimatedDuration: 30,
              userProgress: { status: 'not_started' }
            }
          ],
          userProgress: { status: 'locked', progressPercentage: 0 }
        },
        {
          id: '3',
          title: 'Password Security & MFA',
          description: 'Creating strong passwords and using multi-factor authentication',
          order: 3,
          estimatedDuration: 90,
          lessons: [
            {
              id: '3-1',
              title: 'Creating Strong Passwords',
              description: 'Best practices for password creation and management',
              type: 'theory',
              order: 1,
              estimatedDuration: 30,
              userProgress: { status: 'not_started' }
            },
            {
              id: '3-2',
              title: 'Password Managers',
              description: 'Using password managers effectively',
              type: 'practical',
              order: 2,
              estimatedDuration: 30,
              userProgress: { status: 'not_started' }
            },
            {
              id: '3-3',
              title: 'Multi-Factor Authentication',
              description: 'Setting up and using MFA for better security',
              type: 'practical',
              order: 3,
              estimatedDuration: 30,
              userProgress: { status: 'not_started' }
            }
          ],
          userProgress: { status: 'locked', progressPercentage: 0 }
        }
      ],
      userProgress: {
        progressPercentage: 25,
        completedModules: 1,
        totalModules: 6
      }
    }

    setCourse(mockCourse)
    setLoading(false)
  }, [courseId])

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
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(lesson.userProgress?.status || 'not_started')}
                            <div>
                              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                              <p className="text-sm text-gray-600">{lesson.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 capitalize">{lesson.type}</span>
                            <span className="text-xs text-gray-500">{lesson.estimatedDuration} min</span>
                            <button 
                              onClick={() => router.push(`/learning/${courseId}/lesson/${lesson.id}`)}
                              className="text-warm-copper hover:text-warm-bronze transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Quiz */}
                      {module.quiz && (
                        <div className="flex items-center justify-between p-4 bg-warm-copper/10 rounded-lg border border-warm-copper/20">
                          <div className="flex items-center space-x-3">
                            <Target className="w-5 h-5 text-warm-copper" />
                            <div>
                              <h4 className="font-medium text-gray-900">{module.quiz.title}</h4>
                              <p className="text-sm text-gray-600">{module.quiz.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{module.quiz.timeLimit} min</span>
                            <span className="text-xs text-gray-500">{module.quiz.passingScore}% to pass</span>
                            <button 
                              onClick={() => router.push(`/learning/${courseId}/quiz/${module.quiz.id}`)}
                              className="bg-warm-copper text-white px-3 py-1 rounded text-sm hover:bg-warm-bronze transition-colors"
                            >
                              Start Quiz
                            </button>
                          </div>
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
