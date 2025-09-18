export interface Course {
  id: string
  title: string
  description: string
  level: 'foundation' | 'intermediate' | 'advanced' | 'expert'
  status: 'draft' | 'published' | 'archived'
  estimatedDuration: number
  learningObjectives: string[]
  tags: string[]
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  modules?: Module[]
}

export interface Module {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  estimatedDuration: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  lessons?: Lesson[]
  quiz?: Quiz
}

export interface Lesson {
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

export interface Quiz {
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
  questions?: Question[]
}

export interface Question {
  id: string
  quizId: string
  text: string
  type: 'multiple_choice' | 'true_false' | 'single_choice' | 'fill_in_blank' | 'essay'
  answers: Answer[]
  explanation: string
  points: number
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Answer {
  text: string
  isCorrect: boolean
}
