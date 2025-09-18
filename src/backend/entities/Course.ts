export enum CourseLevel {
  FOUNDATION = 'foundation',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface Course {
  id: string
  title: string
  description: string
  level: CourseLevel
  status: CourseStatus
  estimatedDuration: number // in minutes
  prerequisites: string[] // course IDs
  learningObjectives: string[]
  tags: string[]
  isActive: boolean
  createdBy: string // user ID
  createdAt: Date
  updatedAt: Date
}

export interface CreateCourseData {
  title: string
  description: string
  level: CourseLevel
  estimatedDuration: number
  prerequisites?: string[]
  learningObjectives: string[]
  tags: string[]
  createdBy: string
}

export interface UpdateCourseData {
  title?: string
  description?: string
  level?: CourseLevel
  status?: CourseStatus
  estimatedDuration?: number
  prerequisites?: string[]
  learningObjectives?: string[]
  tags?: string[]
  isActive?: boolean
}
