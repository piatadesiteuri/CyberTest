export interface Module {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  estimatedDuration: number // in minutes
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateModuleData {
  courseId: string
  title: string
  description: string
  order: number
  estimatedDuration: number
}

export interface UpdateModuleData {
  title?: string
  description?: string
  order?: number
  estimatedDuration?: number
  isActive?: boolean
}
