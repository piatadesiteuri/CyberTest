export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SINGLE_CHOICE = 'single_choice',
  FILL_IN_BLANK = 'fill_in_blank',
  ESSAY = 'essay'
}

export interface Answer {
  id: string
  text: string
  isCorrect: boolean
  explanation?: string
}

export interface Question {
  id: string
  quizId: string
  text: string
  type: QuestionType
  answers: Answer[]
  explanation: string
  points: number
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateQuestionData {
  quizId: string
  text: string
  type: QuestionType
  answers: Omit<Answer, 'id'>[]
  explanation: string
  points: number
  order: number
}

export interface UpdateQuestionData {
  text?: string
  type?: QuestionType
  answers?: Omit<Answer, 'id'>[]
  explanation?: string
  points?: number
  order?: number
  isActive?: boolean
}
