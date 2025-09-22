'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Users, Clock, BookOpen, Search, Filter } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import CourseContentBuilder from './CourseContentBuilder'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Utility function to safely parse dates
const safeDate = (dateString: any): string => {
  try {
    if (!dateString) return new Date().toISOString().split('T')[0]
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0]
    return date.toISOString().split('T')[0]
  } catch (error) {
    console.warn('Invalid date:', dateString)
    return new Date().toISOString().split('T')[0]
  }
}

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
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null)
  const [contentBuilderCourse, setContentBuilderCourse] = useState<Course | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const { showToast } = useToast()

  // Fetch courses from backend
  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/learning/courses/stats`)
      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data)
        
        // Handle different response structures
        let coursesData = []
        if (data.success && data.data && data.data.courses) {
          coursesData = data.data.courses
        } else if (data.success && Array.isArray(data.data)) {
          coursesData = data.data
        } else if (Array.isArray(data)) {
          coursesData = data
        } else {
          console.warn('Unexpected API response structure:', data)
          coursesData = []
        }
        
        // Transform backend data to match our interface
        const transformedCourses: Course[] = coursesData.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          level: course.level,
          status: course.status,
          estimatedDuration: course.estimatedDuration || course.estimated_duration,
          enrolledUsers: course.enrolledUsers || 0,
          completionRate: course.completionRate || 0,
          createdAt: safeDate(course.createdAt || course.created_at),
          updatedAt: safeDate(course.updatedAt || course.updated_at)
        }))
        
        setCourses(transformedCourses)
      } else {
        // Try to get error message from response
        try {
          const errorData = await response.json()
          console.error('API Error:', errorData)
        } catch (e) {
          console.error('Failed to parse error response')
        }
        
        // Fallback to mock data if API fails
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
        setCourses(mockCourses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      showToast('Failed to fetch courses', 'error')
      
      // Fallback to mock data
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
        }
      ]
      setCourses(mockCourses)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = async (courseData: Partial<Course>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/learning/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: courseData.title,
          description: courseData.description,
          level: courseData.level || 'foundation',
          estimatedDuration: courseData.estimatedDuration || 60,
          learningObjectives: (courseData as any).learningObjectives?.filter((obj: string) => obj.trim()) || ['Complete the course successfully'],
          tags: (courseData as any).tags?.filter((tag: string) => tag.trim()) || ['cybersecurity'],
          createdBy: '352b6aae-945a-11f0-9fe8-902a222c76cd', // Admin user ID - should be dynamic
          prerequisites: (courseData as any).prerequisites || []
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Course creation response:', result)
        const newCourse = result.data.course
        
        // Transform backend response to match our interface
        const transformedCourse: Course = {
          id: newCourse.id,
          title: newCourse.title,
          description: newCourse.description,
          level: newCourse.level,
          status: newCourse.status,
          estimatedDuration: newCourse.estimatedDuration || newCourse.estimated_duration,
          enrolledUsers: 0,
          completionRate: 0,
          createdAt: safeDate(newCourse.createdAt || newCourse.created_at),
          updatedAt: safeDate(newCourse.updatedAt || newCourse.updated_at)
        }
        
        setCourses([...courses, transformedCourse])
        setShowCreateModal(false)
        showToast('Course created successfully', 'success')
        
        // Refresh courses list
        fetchCourses()
      } else {
        // Fallback to local creation if backend fails
        const newCourse: Course = {
          id: Date.now().toString(),
          title: courseData.title || '',
          description: courseData.description || '',
          level: courseData.level || 'beginner',
          status: 'draft',
          estimatedDuration: courseData.estimatedDuration || 60,
          enrolledUsers: 0,
          completionRate: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        }
        setCourses([...courses, newCourse])
        setShowCreateModal(false)
        showToast('Course created locally (backend unavailable)', 'warning')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      
      // Fallback to local creation
      const newCourse: Course = {
        id: Date.now().toString(),
        title: courseData.title || '',
        description: courseData.description || '',
        level: courseData.level || 'beginner',
        status: 'draft',
        estimatedDuration: courseData.estimatedDuration || 60,
        enrolledUsers: 0,
        completionRate: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      setCourses([...courses, newCourse])
      setShowCreateModal(false)
      showToast('Course created locally (network error)', 'warning')
    }
  }

  const handleEditCourse = (courseId: string, courseData: Partial<Course>) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId ? { ...course, ...courseData, updatedAt: new Date().toISOString().split('T')[0] } : course
    )
    setCourses(updatedCourses)
    setEditingCourse(null)
    showToast('Course updated successfully', 'success')
  }

  const handleDeleteCourse = (courseId: string) => {
    const updatedCourses = courses.filter(course => course.id !== courseId)
    setCourses(updatedCourses)
    showToast('Course deleted successfully', 'success')
  }

  const handlePublishCourse = (courseId: string) => {
    const updatedCourses = courses.map(course =>
      course.id === courseId ? { ...course, status: 'published', updatedAt: new Date().toISOString().split('T')[0] } : course
    )
    setCourses(updatedCourses)
    showToast('Course published successfully', 'success')
  }

  const handleViewCourse = (course: Course) => {
    setViewingCourse(course)
  }

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === '' || course.status === filterStatus
    const matchesLevel = filterLevel === '' || course.level === filterLevel
    
    return matchesSearch && matchesStatus && matchesLevel
  })

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

      {/* Search and Filters */}
      <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-harmony-cream" />
              <input
                type="text"
                placeholder="Search courses by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            >
              <option value="">All Status</option>
              <option value="published" className="bg-harmony-dark text-white">Published</option>
              <option value="draft" className="bg-harmony-dark text-white">Draft</option>
              <option value="archived" className="bg-harmony-dark text-white">Archived</option>
            </select>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            >
              <option value="">All Levels</option>
              <option value="beginner" className="bg-harmony-dark text-white">Beginner</option>
              <option value="intermediate" className="bg-harmony-dark text-white">Intermediate</option>
              <option value="advanced" className="bg-harmony-dark text-white">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-harmony-cream text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-white">{filteredCourses.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-harmony-cream text-sm">Published</p>
              <p className="text-2xl font-bold text-white">
                {filteredCourses.filter(c => c.status === 'published').length}
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
                {filteredCourses.reduce((sum, c) => sum + c.enrolledUsers, 0)}
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
                {filteredCourses.length > 0 ? Math.round(filteredCourses.reduce((sum, c) => sum + c.estimatedDuration, 0) / filteredCourses.length) : 0}m
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
              {filteredCourses.map((course) => (
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
                    <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                      {course.status === 'draft' && (
                        <button
                          onClick={() => handlePublishCourse(course.id)}
                          className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors"
                        >
                          Publish
                        </button>
                      )}
                    </div>
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
                      <button 
                        onClick={() => handleViewCourse(course)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="View Course"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setEditingCourse(course)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Edit Course"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Course"
                      >
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
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateCourse}
        />
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSubmit={(courseData) => handleEditCourse(editingCourse.id, courseData)}
        />
      )}

      {/* View Course Modal */}
      {viewingCourse && (
        <ViewCourseModal
          course={viewingCourse}
          onClose={() => setViewingCourse(null)}
          onOpenContentBuilder={(course) => {
            setContentBuilderCourse(course)
            setViewingCourse(null)
          }}
        />
      )}

      {/* Course Content Builder */}
      {contentBuilderCourse && (
        <CourseContentBuilder
          course={contentBuilderCourse}
          onClose={() => setContentBuilderCourse(null)}
        />
      )}
    </div>
  )
}

// Create Course Modal Component
interface CreateCourseModalProps {
  onClose: () => void
  onSubmit: (courseData: Partial<Course>) => void
}

function CreateCourseModal({ onClose, onSubmit }: CreateCourseModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'foundation',
    estimatedDuration: 60,
    learningObjectives: [''],
    tags: [''],
    prerequisites: []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-2xl border border-harmony-cream/20 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Course</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Course Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
              placeholder="Enter course title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
              placeholder="Enter course description..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-harmony-cream mb-1">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
              >
                <option value="foundation" className="bg-harmony-dark text-white">Foundation</option>
                <option value="intermediate" className="bg-harmony-dark text-white">Intermediate</option>
                <option value="advanced" className="bg-harmony-dark text-white">Advanced</option>
                <option value="expert" className="bg-harmony-dark text-white">Expert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-harmony-cream mb-1">Duration (minutes)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 60 })}
                className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
              />
            </div>
          </div>
          
          {/* Learning Objectives */}
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Learning Objectives</label>
            {formData.learningObjectives.map((objective, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => {
                    const newObjectives = [...formData.learningObjectives]
                    newObjectives[index] = e.target.value
                    setFormData({ ...formData, learningObjectives: newObjectives })
                  }}
                  className="flex-1 px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
                  placeholder="Enter learning objective..."
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newObjectives = formData.learningObjectives.filter((_, i) => i !== index)
                      setFormData({ ...formData, learningObjectives: newObjectives })
                    }}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, learningObjectives: [...formData.learningObjectives, ''] })}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              + Add Learning Objective
            </button>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Tags</label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => {
                    const newTags = [...formData.tags]
                    newTags[index] = e.target.value
                    setFormData({ ...formData, tags: newTags })
                  }}
                  className="flex-1 px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
                  placeholder="Enter tag..."
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = formData.tags.filter((_, i) => i !== index)
                      setFormData({ ...formData, tags: newTags })
                    }}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tags: [...formData.tags, ''] })}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              + Add Tag
            </button>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// View Course Modal Component
interface ViewCourseModalProps {
  course: Course
  onClose: () => void
  onOpenContentBuilder: (course: Course) => void
}

function ViewCourseModal({ course, onClose, onOpenContentBuilder }: ViewCourseModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-4xl border border-harmony-cream/20 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold text-white">Course Details</h3>
          <button
            onClick={onClose}
            className="text-harmony-cream hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-harmony-cream mb-2">Basic Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-harmony-cream/80 mb-1">Course Title</label>
                  <p className="text-white bg-white/10 px-3 py-2 rounded-lg border border-harmony-cream/20">
                    {course.title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-harmony-cream/80 mb-1">Description</label>
                  <p className="text-white bg-white/10 px-3 py-2 rounded-lg border border-harmony-cream/20 min-h-[80px]">
                    {course.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-harmony-cream/80 mb-1">Level</label>
                    <p className="text-white bg-white/10 px-3 py-2 rounded-lg border border-harmony-cream/20 capitalize">
                      {course.level}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-harmony-cream/80 mb-1">Status</label>
                    <span className={`inline-block px-3 py-2 text-xs font-semibold rounded-lg ${
                      course.status === 'published' ? 'bg-green-600/20 text-green-300 border border-green-600/30' :
                      course.status === 'draft' ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-600/30' :
                      'bg-gray-600/20 text-gray-300 border border-gray-600/30'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Metrics */}
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-harmony-cream mb-2">Course Metrics</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-harmony-cream/80 mb-1">Duration</label>
                  <p className="text-white bg-white/10 px-3 py-2 rounded-lg border border-harmony-cream/20">
                    {course.estimatedDuration} minutes
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-harmony-cream/80 mb-1">Enrolled Users</label>
                  <p className="text-white bg-white/10 px-3 py-2 rounded-lg border border-harmony-cream/20">
                    {course.enrolledUsers} students
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-harmony-cream/80 mb-1">Completion Rate</label>
                  <div className="bg-white/10 px-3 py-2 rounded-lg border border-harmony-cream/20">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-700 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${course.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-medium">{course.completionRate}%</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-harmony-cream/80 mb-1">Created</label>
                    <p className="text-white bg-white/10 px-3 py-2 rounded-lg border border-harmony-cream/20 text-sm">
                      {course.createdAt}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-harmony-cream/80 mb-1">Updated</label>
                    <p className="text-white bg-white/10 px-3 py-2 rounded-lg border border-harmony-cream/20 text-sm">
                      {course.updatedAt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Management */}
        <div className="mt-6">
          <h4 className="text-lg font-medium text-harmony-cream mb-4">Course Content</h4>
          <div className="bg-white/10 px-4 py-3 rounded-lg border border-harmony-cream/20">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onOpenContentBuilder(course)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Module</span>
              </button>
              <button
                onClick={() => onOpenContentBuilder(course)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Manage Content</span>
              </button>
              <button
                onClick={() => {
                  // TODO: Implement course preview
                  alert('Course Preview will be implemented')
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Preview Course</span>
              </button>
            </div>
            <p className="text-harmony-cream/60 text-sm mt-3">
              Use these tools to add modules, lessons, and quizzes to make your course interactive and engaging.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Edit Course Modal Component
interface EditCourseModalProps {
  course: Course
  onClose: () => void
  onSubmit: (courseData: Partial<Course>) => void
}

function EditCourseModal({ course, onClose, onSubmit }: EditCourseModalProps) {
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    level: course.level,
    estimatedDuration: course.estimatedDuration,
    status: course.status
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-2xl border border-harmony-cream/20 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Edit Course</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Course Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-harmony-cream mb-1">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
              >
                <option value="foundation" className="bg-harmony-dark text-white">Foundation</option>
                <option value="intermediate" className="bg-harmony-dark text-white">Intermediate</option>
                <option value="advanced" className="bg-harmony-dark text-white">Advanced</option>
                <option value="expert" className="bg-harmony-dark text-white">Expert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-harmony-cream mb-1">Duration (minutes)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 60 })}
                className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-harmony-cream mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
              >
                <option value="draft" className="bg-harmony-dark text-white">Draft</option>
                <option value="published" className="bg-harmony-dark text-white">Published</option>
                <option value="archived" className="bg-harmony-dark text-white">Archived</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
