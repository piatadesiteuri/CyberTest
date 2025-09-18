export enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  LOCKED = 'locked'
}

export interface UserProgress {
  id: string
  userId: string
  courseId: string
  moduleId?: string
  lessonId?: string
  quizId?: string
  status: ProgressStatus
  progressPercentage: number // 0-100
  score?: number // for quizzes
  timeSpent: number // in minutes
  lastAccessedAt: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserProgressData {
  userId: string
  courseId: string
  moduleId?: string
  lessonId?: string
  quizId?: string
  status: ProgressStatus
  progressPercentage: number
  score?: number
  timeSpent?: number
}

export interface UpdateUserProgressData {
  status?: ProgressStatus
  progressPercentage?: number
  score?: number
  timeSpent?: number
  lastAccessedAt?: Date
  completedAt?: Date
}

export interface QuizAttempt {
  id: string
  userId: string
  quizId: string
  answers: QuizAnswer[]
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number // in minutes
  startedAt: Date
  completedAt: Date
  passed: boolean
}

export interface QuizAnswer {
  questionId: string
  answerIds: string[] // for multiple choice
  textAnswer?: string // for fill in blank or essay
  isCorrect: boolean
  points: number
}

export interface CreateQuizAttemptData {
  userId: string
  quizId: string
  answers: Omit<QuizAnswer, 'isCorrect' | 'points'>[]
  timeSpent: number
}
