'use client'

import { Shield, Lock, Network, Code, Database, Server, Eye, Bug } from 'lucide-react'

const curriculumPaths = [
  {
    name: 'Phishing Awareness',
    icon: Shield,
    description: 'Automated phishing simulation campaigns and training',
    level: 'All Users',
    duration: 'Ongoing',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    name: 'Smishing Campaigns',
    icon: Network,
    description: 'SMS-based social engineering attack simulations',
    level: 'All Users',
    duration: 'Ongoing',
    color: 'bg-green-100 text-green-800'
  },
  {
    name: 'Vishing Simulations',
    icon: Code,
    description: 'Voice-based social engineering attack training',
    level: 'High-Risk Groups',
    duration: 'Monthly',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    name: 'APT Simulations',
    icon: Bug,
    description: 'Advanced Persistent Threat attack scenarios',
    level: 'IT Staff',
    duration: 'Quarterly',
    color: 'bg-red-100 text-red-800'
  },
  {
    name: 'Security Awareness',
    icon: Eye,
    description: 'General cybersecurity awareness training modules',
    level: 'All Users',
    duration: 'Monthly',
    color: 'bg-orange-100 text-orange-800'
  },
  {
    name: 'Password Security',
    icon: Lock,
    description: 'Password management and security best practices',
    level: 'All Users',
    duration: 'Quarterly',
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    name: 'Data Protection',
    icon: Database,
    description: 'GDPR compliance and data handling procedures',
    level: 'All Users',
    duration: 'Annually',
    color: 'bg-pink-100 text-pink-800'
  },
  {
    name: 'Incident Response',
    icon: Server,
    description: 'Security incident reporting and response procedures',
    level: 'Security Team',
    duration: 'Semi-annually',
    color: 'bg-cyan-100 text-cyan-800'
  }
]

export default function CurriculumSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-harmony-dark mb-4">
            Training Programs & Simulations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive cybersecurity training modules with automated social engineering campaigns, 
            personalized content allocation, and real-time progress monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {curriculumPaths.map((path) => {
            const Icon = path.icon
            return (
              <div key={path.name} className="card hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center mb-4">
                  <div className="bg-harmony-cream/20 p-3 rounded-lg group-hover:bg-harmony-tan/20 transition-colors">
                    <Icon className="h-6 w-6 text-harmony-dark" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-harmony-dark">{path.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${path.color}`}>
                      {path.level}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{path.description}</p>
                <p className="text-sm text-gray-500">Duration: {path.duration}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <button className="btn-primary text-lg px-8 py-3">
            Explore curriculum
          </button>
        </div>
      </div>
    </section>
  )
}
