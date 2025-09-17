'use client'

import { BookOpen, Users, Calendar, Award } from 'lucide-react'

const trainingPrograms = [
  {
    id: 1,
    name: 'Phishing Awareness',
    progress: 85,
    participants: 1247,
    completed: 1060,
    nextSession: '2024-01-15',
    status: 'active',
    type: 'Automated Campaign',
  },
  {
    id: 2,
    name: 'Smishing Campaigns',
    progress: 78,
    participants: 1247,
    completed: 972,
    nextSession: '2024-01-20',
    status: 'active',
    type: 'SMS Simulation',
  },
  {
    id: 3,
    name: 'Vishing Simulations',
    progress: 45,
    participants: 312,
    completed: 140,
    nextSession: '2024-01-25',
    status: 'active',
    type: 'Voice Attack',
  },
  {
    id: 4,
    name: 'APT Simulations',
    progress: 100,
    participants: 89,
    completed: 89,
    nextSession: '2024-02-01',
    status: 'completed',
    type: 'Advanced Threat',
  },
]

export default function TrainingProgress() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-harmony-dark">Training Progress</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <BookOpen className="h-4 w-4" />
          <span>4 Active Programs</span>
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
                <p className="text-sm text-gray-500">{program.type}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                program.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
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
      
      <div className="mt-6">
        <button className="w-full btn-secondary">
          Manage Training Programs
        </button>
      </div>
    </div>
  )
}
