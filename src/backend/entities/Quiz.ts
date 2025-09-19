export enum QuizType {
  PRE_ASSESSMENT = 'pre_assessment',
  POST_ASSESSMENT = 'post_assessment',
  PRACTICE = 'practice',
  FINAL_EXAM = 'final_exam'
}

export enum QuizStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

// Type alias for Question to avoid circular dependency
type Question = {
  id: string
  quizId: string
  text: string
  type: string
  answers: any[]
  explanation: string
  points: number
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}


export interface Quiz {
  id: string
  moduleId: string
  title: string
  description: string
  type: QuizType
  status: QuizStatus
  timeLimit: number // in minutes, 0 = no limit
  passingScore: number // percentage (0-100)
  maxAttempts: number // 0 = unlimited
  questions: Question[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateQuizData {
  moduleId: string
  title: string
  description: string
  type: QuizType
  timeLimit?: number
  passingScore: number
  maxAttempts?: number
}

export interface UpdateQuizData {
  title?: string
  description?: string
  type?: QuizType
  status?: QuizStatus
  timeLimit?: number
  passingScore?: number
  maxAttempts?: number
  isActive?: boolean
}
