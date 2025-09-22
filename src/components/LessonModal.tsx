'use client'

import { useState } from 'react'
import { X, Save, Eye } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface LessonModalProps {
  moduleId: string
  onClose: () => void
  onLessonCreated: (lesson: any) => void
}

export default function LessonModal({ moduleId, onClose, onLessonCreated }: LessonModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: 'theory' as 'theory' | 'practical' | 'video' | 'interactive' | 'documentation',
    estimatedDuration: 15,
    order: 1
  })
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const lessonTypes = [
    { value: 'theory', label: 'Theory', description: 'Theoretical content and concepts' },
    { value: 'practical', label: 'Practical', description: 'Hands-on exercises and labs' },
    { value: 'video', label: 'Video', description: 'Video content and tutorials' },
    { value: 'interactive', label: 'Interactive', description: 'Interactive simulations' },
    { value: 'documentation', label: 'Documentation', description: 'Reference materials' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/learning/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId,
          title: formData.title,
          description: formData.description,
          content: formData.content,
          type: formData.type,
          order: formData.order,
          estimatedDuration: formData.estimatedDuration
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Lesson creation response:', result) // Debug log
        
        // Handle different response structures
        let newLesson;
        if (result.data && result.data.lesson) {
          newLesson = result.data.lesson
        } else if (result.data && Array.isArray(result.data.lessons) && result.data.lessons.length > 0) {
          newLesson = result.data.lessons[0] // Take first lesson if it's an array
        } else if (result.data) {
          newLesson = result.data
        } else {
          newLesson = result
        }
        
        onLessonCreated(newLesson)
        showToast('Lesson created successfully', 'success')
        onClose()
      } else {
        // Fallback for development
        const mockLesson = {
          id: Date.now().toString(),
          moduleId,
          title: formData.title,
          description: formData.description,
          content: formData.content,
          type: formData.type,
          order: formData.order,
          estimatedDuration: formData.estimatedDuration,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        onLessonCreated(mockLesson)
        showToast('Lesson created locally', 'warning')
        onClose()
      }
    } catch (error) {
      console.error('Error creating lesson:', error)
      showToast('Failed to create lesson', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderContent = () => {
    if (isPreviewMode) {
      return (
        <div 
          className="prose prose-invert max-w-none bg-white/5 p-4 rounded-lg border border-harmony-cream/20 min-h-[300px]"
          dangerouslySetInnerHTML={{ __html: formData.content }}
        />
      )
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-harmony-cream">Lesson Content</label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setIsPreviewMode(true)}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
            >
              <Eye className="h-3 w-3" />
              <span>Preview</span>
            </button>
          </div>
        </div>
        <RichTextEditor
          value={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-harmony-cream/20">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Create New Lesson</h3>
            <p className="text-harmony-cream/80 text-sm">Add educational content to your module</p>
          </div>
          <div className="flex space-x-2">
            {isPreviewMode && (
              <button
                onClick={() => setIsPreviewMode(false)}
                className="text-harmony-cream hover:text-white transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="text-harmony-cream hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-harmony-cream mb-2">Lesson Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
                placeholder="Enter lesson title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-harmony-cream mb-2">Lesson Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
              >
                {lessonTypes.map(type => (
                  <option key={type.value} value={type.value} className="bg-harmony-dark">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
              placeholder="Brief description of the lesson..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-harmony-cream mb-2">Estimated Duration (minutes)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 15 })}
                className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-harmony-cream mb-2">Order in Module</label>
              <input
                type="number"
                required
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
              />
            </div>
          </div>

          {/* Content Editor */}
          <div>
            {renderContent()}
          </div>

          {/* Type Description */}
          <div className="bg-blue-600/10 p-4 rounded-lg border border-blue-600/20">
            <h4 className="text-blue-300 font-medium mb-2">
              {lessonTypes.find(t => t.value === formData.type)?.label} Lesson
            </h4>
            <p className="text-blue-200/80 text-sm">
              {lessonTypes.find(t => t.value === formData.type)?.description}
            </p>
          </div>

          {/* Actions */}
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
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Creating...' : 'Create Lesson'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Rich Text Editor Component
interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const toolbarButtons = [
    { command: 'bold', icon: 'B', title: 'Bold' },
    { command: 'italic', icon: 'I', title: 'Italic' },
    { command: 'underline', icon: 'U', title: 'Underline' },
    { command: 'insertOrderedList', icon: '1.', title: 'Numbered List' },
    { command: 'insertUnorderedList', icon: '•', title: 'Bullet List' },
    { command: 'insertHorizontalRule', icon: '—', title: 'Horizontal Line' }
  ]

  const execCommand = (command: string) => {
    document.execCommand(command, false)
  }

  const insertHeading = (level: number) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const heading = document.createElement(`h${level}`)
      heading.textContent = 'Heading ' + level
      heading.style.color = 'white'
      heading.style.marginTop = '1rem'
      heading.style.marginBottom = '0.5rem'
      range.deleteContents()
      range.insertNode(heading)
    }
  }

  return (
    <div className="border border-harmony-cream/20 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-white/5 p-2 border-b border-harmony-cream/20 flex flex-wrap gap-1">
        <select
          onChange={(e) => {
            if (e.target.value) {
              insertHeading(parseInt(e.target.value))
              e.target.value = ''
            }
          }}
          className="bg-white/10 text-white text-sm px-2 py-1 rounded border border-harmony-cream/20"
          defaultValue=""
        >
          <option value="">Heading</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
        </select>
        
        {toolbarButtons.map((btn) => (
          <button
            key={btn.command}
            type="button"
            onClick={() => execCommand(btn.command)}
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded border border-harmony-cream/20 transition-colors"
            title={btn.title}
          >
            {btn.icon}
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            const link = prompt('Enter URL:')
            if (link) {
              document.execCommand('createLink', false, link)
            }
          }}
          className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded border border-harmony-cream/20 transition-colors"
          title="Insert Link"
        >
          🔗
        </button>

        <button
          type="button"
          onClick={() => {
            const imageUrl = prompt('Enter image URL:')
            if (imageUrl) {
              document.execCommand('insertImage', false, imageUrl)
            }
          }}
          className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded border border-harmony-cream/20 transition-colors"
          title="Insert Image"
        >
          🖼️
        </button>
      </div>

      {/* Editor */}
      <div
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[300px] p-4 bg-white/5 text-white prose prose-invert max-w-none focus:outline-none"
        style={{
          lineHeight: '1.6',
        }}
      />

      {/* Help Text */}
      <div className="bg-white/5 p-2 border-t border-harmony-cream/20">
        <p className="text-harmony-cream/60 text-xs">
          Use the toolbar above to format your content. You can add headings, lists, links, and images.
        </p>
      </div>
    </div>
  )
}
