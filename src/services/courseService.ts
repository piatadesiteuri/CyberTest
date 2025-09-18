import { Course } from '@/types/course'

export interface CourseService {
  getCourses(): Promise<Course[]>
  getCourseById(id: string): Promise<Course | null>
}

class CourseServiceImpl implements CourseService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  async getCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/courses`)
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }
      const data = await response.json()
      return data.courses || []
    } catch (error) {
      console.error('Error fetching courses:', error)
      return []
    }
  }

  async getCourseById(id: string): Promise<Course | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/courses/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch course')
      }
      const data = await response.json()
      return data.course || null
    } catch (error) {
      console.error('Error fetching course:', error)
      return null
    }
  }
}

export const courseService = new CourseServiceImpl()
