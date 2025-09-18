'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardHeader from './DashboardHeader'
import { BookOpen, Trophy, Clock, Star, ChevronRight, Play, CheckCircle, Lock, Users, Target, Zap } from 'lucide-react'
import CyberShield from './icons/CyberShield'
import PhishingHook from './icons/PhishingHook'
import SecurityLock from './icons/SecurityLock'
import NetworkSecurity from './icons/NetworkSecurity'
import ThreatDetection from './icons/ThreatDetection'
import CyberTraining from './icons/CyberTraining'

export default function UserDashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan">
      {/* Header */}
      <DashboardHeader onMenuClick={() => {}} />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-harmony-dark rounded-full mb-6">
            <CyberShield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-harmony-dark mb-4">
            Cybersecurity Training Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome back, {user?.firstName}! Master cybersecurity skills through interactive training, 
            real-world simulations, and hands-on exercises. Your journey to becoming security-aware starts here.
          </p>
        </div>

        {/* User Progress Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{user?.firstName?.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-600 capitalize">{user?.role?.replace('_', ' ')} • {user?.department}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-harmony-dark">87%</div>
              <div className="text-gray-600">Overall Progress</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div className="bg-gradient-to-r from-harmony-dark to-green-600 h-4 rounded-full" style={{width: '87%'}}></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>8 of 12 modules completed</span>
            <span>4 modules remaining</span>
          </div>
        </div>

        {/* Learning Paths Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-harmony-dark mb-4">Choose Your Learning Path</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Select a specialized track based on your role and experience level. Each path is designed to build practical cybersecurity skills.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Foundation Path */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <CyberShield className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">FOUNDATION</div>
                  <div className="text-2xl font-bold text-gray-900">6 Modules</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cybersecurity Fundamentals</h3>
              <p className="text-gray-600 mb-6">
                Master the basics of cybersecurity, threat awareness, and security best practices. 
                Perfect for all employees regardless of technical background.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <BookOpen className="w-4 h-4" />
                  <span>12 Lessons</span>
                  <span>•</span>
                  <span>4 Quizzes</span>
                </div>
                <button className="bg-harmony-dark text-white px-6 py-2 rounded-lg hover:bg-harmony-dark/90 transition-colors flex items-center">
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Advanced Path */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <ThreatDetection className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">ADVANCED</div>
                  <div className="text-2xl font-bold text-gray-900">8 Modules</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Threat Analysis & Response</h3>
              <p className="text-gray-600 mb-6">
                Deep dive into advanced threat detection, incident response, and security architecture. 
                Designed for IT professionals and security teams.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <BookOpen className="w-4 h-4" />
                  <span>18 Lessons</span>
                  <span>•</span>
                  <span>6 Labs</span>
                </div>
                <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center">
                  Locked
                  <Lock className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Management Path */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <NetworkSecurity className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">MANAGEMENT</div>
                  <div className="text-2xl font-bold text-gray-900">5 Modules</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security Leadership</h3>
              <p className="text-gray-600 mb-6">
                Learn to lead security initiatives, manage teams, and implement security policies. 
                Essential for managers and executives.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <BookOpen className="w-4 h-4" />
                  <span>10 Lessons</span>
                  <span>•</span>
                  <span>3 Case Studies</span>
                </div>
                <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center">
                  Locked
                  <Lock className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Current Learning Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Learning Progress</h2>
          
          <div className="space-y-6">
            {/* Module 1 */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Introduction to Cybersecurity</h3>
                  <p className="text-gray-600 text-sm">Understanding threats and security fundamentals</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-600 font-semibold">Completed</div>
                <div className="text-sm text-gray-500">100%</div>
              </div>
            </div>

            {/* Module 2 */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <PhishingHook className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phishing Awareness & Prevention</h3>
                  <p className="text-gray-600 text-sm">Recognizing and avoiding phishing attacks</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-blue-600 font-semibold">In Progress</div>
                <div className="text-sm text-gray-500">65%</div>
              </div>
            </div>

            {/* Module 3 */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                  <SecurityLock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Password Security & MFA</h3>
                  <p className="text-gray-600 text-sm">Creating strong passwords and using multi-factor authentication</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 font-semibold">Locked</div>
                <div className="text-sm text-gray-500">Complete previous module</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements & Gamification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Achievements</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">First Quiz Master</h3>
                  <p className="text-gray-600 text-sm">Scored 100% on your first security quiz</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Star className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Consistent Learner</h3>
                  <p className="text-gray-600 text-sm">Completed 5 consecutive days of training</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <Zap className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Learner</h3>
                  <p className="text-gray-600 text-sm">Finished a module in record time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Leaderboard</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
                    <p className="text-gray-600 text-sm">IT Department</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-600">2,450</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mike Chen</h3>
                    <p className="text-gray-600 text-sm">Finance Department</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-600">2,180</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">You</h3>
                    <p className="text-gray-600 text-sm">{user?.department} Department</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">1,920</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-harmony-dark to-green-700 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Continue Learning?</h2>
          <p className="text-harmony-cream mb-6 max-w-2xl">
            Take the next step in your cybersecurity journey. Choose from our interactive modules, 
            hands-on labs, or real-world simulations.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-harmony-dark px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center">
              <CyberTraining className="w-5 h-5 mr-2" />
              Resume Training
            </button>
            <button className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center">
              <PhishingHook className="w-5 h-5 mr-2" />
              Take Simulation
            </button>
            <button className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Modules
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}