'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Users, Clock, BookOpen } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  level: string
  status: string
  estimatedDuration: number
  enrolledUsers: number
  completionRate: number
  createdAt: string
  updatedAt: string
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock data for now
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Cybersecurity Fundamentals',
        description: 'Learn the basics of cybersecurity including threats, vulnerabilities, and protection methods.',
        level: 'beginner',
        status: 'published',
        estimatedDuration: 120,
        enrolledUsers: 45,
        completionRate: 78,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20'
      },
      {
        id: '2',
        title: 'Advanced Threat Detection',
        description: 'Deep dive into advanced threat detection techniques and incident response.',
        level: 'advanced',
        status: 'published',
        estimatedDuration: 180,
        enrolledUsers: 23,
        completionRate: 65,
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18'
      },
      {
        id: '3',
        title: 'Social Engineering Awareness',
        description: 'Understanding and preventing social engineering attacks.',
        level: 'intermediate',
        status: 'draft',
        estimatedDuration: 90,
        enrolledUsers: 0,
        completionRate: 0,
        createdAt: '2024-01-25',
        updatedAt: '2024-01-25'
      }
    ]
    
    setTimeout(() => {
      setCourses(mockCourses)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'archived':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-500/20 text-blue-400'
      case 'intermediate':
        return 'bg-purple-500/20 text-purple-400'
      case 'advanced':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Course Management</h2>
          <p className="text-harmony-cream">Manage training programs and course content</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Course</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-harmony-cream text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-white">{courses.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-harmony-cream text-sm">Published</p>
              <p className="text-2xl font-bold text-white">
                {courses.filter(c => c.status === 'published').length}
              </p>
            </div>
            <Eye className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-harmony-cream text-sm">Total Enrollments</p>
              <p className="text-2xl font-bold text-white">
                {courses.reduce((sum, c) => sum + c.enrolledUsers, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-harmony-cream text-sm">Avg. Duration</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(courses.reduce((sum, c) => sum + c.estimatedDuration, 0) / courses.length)}m
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg border border-harmony-cream/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-harmony-cream/20">
          <h3 className="text-lg font-semibold text-white">All Courses</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">
                  Completion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{course.title}</div>
                      <div className="text-sm text-harmony-cream truncate max-w-xs">
                        {course.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-harmony-cream">
                    {course.estimatedDuration}m
                  </td>
                  <td className="px-6 py-4 text-sm text-harmony-cream">
                    {course.enrolledUsers}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${course.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-harmony-cream">{course.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-md border border-harmony-cream/20">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Course</h3>
            <p className="text-harmony-cream mb-4">Course creation form will be implemented here.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
