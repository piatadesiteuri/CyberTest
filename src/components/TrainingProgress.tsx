'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Users, Calendar, Award } from 'lucide-react'
import { adminService, TrainingProgram } from '@/services/adminService'

export default function TrainingProgress() {
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainingPrograms = async () => {
      try {
        setLoading(true)
        const data = await adminService.getTrainingPrograms()
        setTrainingPrograms(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch training programs')
        console.error('Error fetching training programs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainingPrograms()
  }, [])

  const handleCreateProgram = async () => {
    try {
      const newProgram = await adminService.createTrainingProgram({
        name: 'New Training Program',
        progress: 0,
        participants: 0,
        completed: 0,
        nextSession: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
        status: 'draft',
        type: 'Training Course',
        level: 'foundation'
      })
      setTrainingPrograms([...trainingPrograms, newProgram])
    } catch (err) {
      console.error('Error creating training program:', err)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-2 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load training programs</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const activePrograms = trainingPrograms.filter(p => p.status === 'active').length

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-harmony-dark">Training Progress</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <BookOpen className="h-4 w-4" />
          <span>{activePrograms} Active Programs</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {trainingPrograms.map((program) => (
          <div key={program.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {program.name}
                </h3>
                <p className="text-sm text-gray-500">{program.type} • {program.level}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                program.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : program.status === 'active'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {program.status}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{program.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-harmony-tan h-2 rounded-full transition-all duration-300"
                  style={{ width: `${program.progress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-gray-600">Participants</p>
                  <p className="font-medium text-gray-900">{program.participants}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-gray-600">Completed</p>
                  <p className="font-medium text-gray-900">{program.completed}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-gray-600">Next Session</p>
                  <p className="font-medium text-gray-900">{program.nextSession}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex space-x-3">
        <button className="flex-1 btn-secondary">
          Manage Training Programs
        </button>
        <button className="btn-primary" onClick={handleCreateProgram}>
          Create New Program
        </button>
      </div>
    </div>
  )
}
