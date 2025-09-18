export enum LessonType {
  THEORY = 'theory',
  PRACTICAL = 'practical',
  VIDEO = 'video',
  INTERACTIVE = 'interactive',
  DOCUMENTATION = 'documentation'
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  description: string
  content: string // HTML content or markdown
  type: LessonType
  order: number
  estimatedDuration: number // in minutes
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateLessonData {
  moduleId: string
  title: string
  description: string
  content: string
  type: LessonType
  order: number
  estimatedDuration: number
}

export interface UpdateLessonData {
  title?: string
  description?: string
  content?: string
  type?: LessonType
  order?: number
  estimatedDuration?: number
  isActive?: boolean
}
