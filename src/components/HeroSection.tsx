'use client'

import { ArrowRight, Shield, Users, Target } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="harmony-gradient py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          All-in-One Cybersecurity
          <br />
          <span className="text-harmony-cream">Training Platform</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-harmony-cream mb-8 max-w-3xl mx-auto">
          Unified, scalable, and automated architecture for cybersecurity training and awareness. Centralized hub for training, simulations, reporting, and user administration.
        </p>
        
        {/* CTA Button */}
         <Link href="/dashboard" className="inline-block bg-white text-harmony-dark hover:bg-harmony-cream font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl mb-12">
          Access Dashboard
          <ArrowRight className="inline ml-2 h-5 w-5" />
        </Link>

        {/* Hero Image Placeholder */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Training Programs</h3>
              <p className="text-harmony-cream text-sm">Automated cybersecurity training</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Social Engineering</h3>
              <p className="text-harmony-cream text-sm">Phishing, smishing, vishing campaigns</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">User Management</h3>
              <p className="text-harmony-cream text-sm">Centralized administration & reporting</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
