'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit, Trash2, BookOpen, Play, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import LessonModal from './LessonModal'
import QuizModal from './QuizModal'
import CoursePreview from './CoursePreview'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cybertest-production.up.railway.app'

// Type definitions
interface Course {
  id: string
  title: string
  description: string
  level: string
  status: string
}

interface Module {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  estimatedDuration: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Lesson {
  id: string
  moduleId: string
  title: string
  description: string
  content: string
  type: 'theory' | 'practical' | 'video' | 'interactive' | 'documentation'
  order: number
  estimatedDuration: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Quiz {
  id: string
  moduleId: string
  title: string
  description: string
  type: 'pre_assessment' | 'post_assessment' | 'practice' | 'final_exam'
  status: 'draft' | 'published' | 'archived'
  timeLimit: number
  passingScore: number
  maxAttempts: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CourseContentBuilderProps {
  course: Course
  onClose: () => void
}

export default function CourseContentBuilder({ course, onClose }: CourseContentBuilderProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<{ [moduleId: string]: Lesson[] }>({})
  const [quizzes, setQuizzes] = useState<{ [moduleId: string]: Quiz[] }>({})
  const [expandedModules, setExpandedModules] = useState<{ [moduleId: string]: boolean }>({})
  const [loading, setLoading] = useState(true)
  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [showLessonModal, setShowLessonModal] = useState<string | null>(null) // moduleId
  const [showQuizModal, setShowQuizModal] = useState<string | null>(null) // moduleId
  const [showPreview, setShowPreview] = useState(false)
  const { showToast } = useToast()

  const fetchCourseContent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/learning/courses/${course.id}/modules`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data) // Debug log
        
        // Handle different response structures
        let modulesData = []
        if (data.success && data.data && data.data.modules && Array.isArray(data.data.modules)) {
          modulesData = data.data.modules
        } else if (data.success && data.data && Array.isArray(data.data)) {
          modulesData = data.data
        } else if (Array.isArray(data)) {
          modulesData = data
        } else if (data.modules && Array.isArray(data.modules)) {
          modulesData = data.modules
        } else if (data.data && Array.isArray(data.data)) {
          modulesData = data.data
        }
        
        console.log('Processed modules data:', modulesData) // Debug log
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
        console.log('API request failed, using mock data')
        // Mock data for development
        const mockModules: Module[] = [
          {
            id: '1',
            courseId: course.id,
            title: 'Introduction to Cybersecurity',
            description: 'Basic concepts and terminology',
            order: 1,
            estimatedDuration: 120,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
        setModules(mockModules)
      }
    } catch (error) {
      console.error('Error fetching course content:', error)
      showToast('Failed to load course content', 'error')
      
      // Fallback to empty array to prevent rendering errors
      setModules([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourseContent()
  }, [course.id])

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

  const handleCreateModule = async (moduleData: Partial<Module>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/learning/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          title: moduleData.title,
          description: moduleData.description,
          order: (Array.isArray(modules) ? modules.length : 0) + 1,
          estimatedDuration: moduleData.estimatedDuration || 60
        })
      })

      if (response.ok) {
        const result = await response.json()
        const newModule = result.data.module
        setModules([...(Array.isArray(modules) ? modules : []), newModule])
        setShowCreateModuleModal(false)
        showToast('Module created successfully', 'success')
      } else {
        // Fallback for development
        const newModule: Module = {
          id: Date.now().toString(),
          courseId: course.id,
          title: moduleData.title || '',
          description: moduleData.description || '',
          order: (Array.isArray(modules) ? modules.length : 0) + 1,
          estimatedDuration: moduleData.estimatedDuration || 60,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setModules([...(Array.isArray(modules) ? modules : []), newModule])
        setShowCreateModuleModal(false)
        showToast('Module created locally', 'warning')
      }
    } catch (error) {
      console.error('Error creating module:', error)
      showToast('Failed to create module', 'error')
    }
  }

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  const handleLessonCreated = (moduleId: string, lesson: any) => {
    console.log('handleLessonCreated received:', lesson) // Debug log
    
    // Handle different lesson data structures
    let actualLesson: Lesson;
    
    if (lesson && lesson.lessons && Array.isArray(lesson.lessons) && lesson.lessons.length > 0) {
      // If lesson is wrapped in {lessons: [...]} format
      actualLesson = lesson.lessons[0];
    } else if (lesson && typeof lesson === 'object' && lesson.id) {
      // If lesson is a direct Lesson object
      actualLesson = lesson;
    } else {
      console.error('Invalid lesson data structure:', lesson);
      showToast('Error: Invalid lesson data received', 'error');
      return;
    }
    
    // Ensure actualLesson is valid before adding to state
    if (!actualLesson || !actualLesson.id) {
      console.error('Lesson missing required properties:', actualLesson);
      showToast('Error: Lesson data incomplete', 'error');
      return;
    }
    
    setLessons(prev => ({
      ...prev,
      [moduleId]: [...(prev[moduleId] || []), actualLesson]
    }))
    setShowLessonModal(null)
    showToast('Lesson added successfully', 'success')
  }

  const handleQuizCreated = (moduleId: string, quiz: any) => {
    console.log('handleQuizCreated received:', quiz) // Debug log
    
    // Handle different quiz data structures
    let actualQuiz: Quiz;
    if (quiz && quiz.quizzes && Array.isArray(quiz.quizzes) && quiz.quizzes.length > 0) {
      // If quiz is wrapped in {quizzes: [...]} format
      actualQuiz = quiz.quizzes[0];
    } else if (quiz && typeof quiz === 'object' && quiz.id) {
      // If quiz is a direct Quiz object
      actualQuiz = quiz;
    } else {
      console.error('Invalid quiz data structure:', quiz);
      return;
    }
    
    setQuizzes(prev => ({
      ...prev,
      [moduleId]: [...(prev[moduleId] || []), actualQuiz]
    }))
    setShowQuizModal(null)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-harmony-dark rounded-lg p-6 border border-harmony-cream/20">
          <div className="text-white">Loading course content...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-harmony-cream/20">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Course Content Builder</h3>
            <p className="text-harmony-cream/80">{course.title}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="text-harmony-cream hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-6">
          <button
            onClick={() => setShowCreateModuleModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Module</span>
          </button>
        </div>

        {/* Course Structure */}
        <div className="space-y-4">
          {!Array.isArray(modules) || modules.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-harmony-cream/40 mx-auto mb-4" />
              <p className="text-harmony-cream/60">No modules yet. Start by adding your first module.</p>
            </div>
          ) : (
            modules.map((module, index) => (
              <div key={module.id} className="bg-white/10 rounded-lg border border-harmony-cream/20">
                {/* Module Header */}
                <div className="p-4 border-b border-harmony-cream/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleModuleExpansion(module.id)}
                        className="text-harmony-cream hover:text-white"
                      >
                        {expandedModules[module.id] ? 
                          <ChevronDown className="h-5 w-5" /> : 
                          <ChevronRight className="h-5 w-5" />
                        }
                      </button>
                      <div>
                        <h4 className="text-lg font-medium text-white">
                          {index + 1}. {module.title}
                        </h4>
                        <p className="text-harmony-cream/80 text-sm">{module.description}</p>
                        <p className="text-harmony-cream/60 text-xs">Duration: {module.estimatedDuration} minutes</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingModule(module)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Edit Module"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement delete module
                          alert('Delete module functionality will be implemented')
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Module"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Module Content */}
                {expandedModules[module.id] && (
                  <div className="p-4">
                    <div className="flex space-x-3 mb-4">
                      <button
                        onClick={() => setShowLessonModal(module.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Lesson</span>
                      </button>
                      <button
                        onClick={() => setShowQuizModal(module.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Quiz</span>
                      </button>
                    </div>

                    {/* Lessons */}
                    <div className="space-y-2">
                      {(lessons[module.id] && Array.isArray(lessons[module.id]) ? lessons[module.id] : []).map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="bg-white/5 p-3 rounded border border-harmony-cream/10">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="text-white font-medium">
                                {lessonIndex + 1}. {lesson.title}
                              </h5>
                              <p className="text-harmony-cream/70 text-sm">{lesson.description}</p>
                              <div className="flex space-x-4 text-xs text-harmony-cream/60 mt-1">
                                <span>Type: {lesson.type}</span>
                                <span>Duration: {lesson.estimatedDuration}m</span>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                                <Edit className="h-3 w-3" />
                              </button>
                              <button className="text-red-400 hover:text-red-300 transition-colors">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Quizzes */}
                      {(quizzes[module.id] && Array.isArray(quizzes[module.id]) ? quizzes[module.id] : []).map((quiz, quizIndex) => (
                        <div key={quiz.id} className="bg-purple-600/10 p-3 rounded border border-purple-600/20">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="text-white font-medium flex items-center space-x-2">
                                <Play className="h-4 w-4 text-purple-400" />
                                <span>Quiz: {quiz.title}</span>
                              </h5>
                              <p className="text-harmony-cream/70 text-sm">{quiz.description}</p>
                              <div className="flex space-x-4 text-xs text-harmony-cream/60 mt-1">
                                <span>Type: {quiz.type}</span>
                                <span>Passing: {quiz.passingScore}%</span>
                                <span>Time Limit: {quiz.timeLimit || 'None'}</span>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                                <Edit className="h-3 w-3" />
                              </button>
                              <button className="text-red-400 hover:text-red-300 transition-colors">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Empty state */}
                      {(!lessons[module.id] || lessons[module.id].length === 0) && 
                       (!quizzes[module.id] || quizzes[module.id].length === 0) && (
                        <div className="text-center py-6 text-harmony-cream/60">
                          <p>No lessons or quizzes yet. Add content to this module.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Course</span>
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Preview Course</span>
          </button>
        </div>
      </div>

      {/* Create Module Modal */}
      {showCreateModuleModal && (
        <CreateModuleModal
          onClose={() => setShowCreateModuleModal(false)}
          onSubmit={handleCreateModule}
        />
      )}

      {/* Add Lesson Modal */}
      {showLessonModal && (
        <LessonModal
          moduleId={showLessonModal}
          onClose={() => setShowLessonModal(null)}
          onLessonCreated={(lesson) => handleLessonCreated(showLessonModal!, lesson)}
        />
      )}

      {/* Add Quiz Modal */}
      {showQuizModal && (
        <QuizModal
          moduleId={showQuizModal}
          onClose={() => setShowQuizModal(null)}
          onQuizCreated={(quiz) => handleQuizCreated(showQuizModal!, quiz)}
        />
      )}

      {/* Course Preview */}
      {showPreview && (
        <CoursePreview
          course={course}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}

// Create Module Modal Component
interface CreateModuleModalProps {
  onClose: () => void
  onSubmit: (moduleData: Partial<Module>) => void
}

function CreateModuleModal({ onClose, onSubmit }: CreateModuleModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedDuration: 60
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-2xl border border-harmony-cream/20">
        <h3 className="text-lg font-semibold text-white mb-4">Create New Module</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Module Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
              placeholder="Enter module title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
              placeholder="Enter module description..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Estimated Duration (minutes)</label>
            <input
              type="number"
              required
              min="1"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 60 })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
            />
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
              Create Module
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
