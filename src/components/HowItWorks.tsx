'use client'

import { BookOpen, Wrench, Users } from 'lucide-react'

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-harmony-dark mb-4">
            Centralized Architecture
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform functions as a central hub for all components - training, simulations, reporting, user administration, 
            and DEER infrastructure integration. Central orchestration synchronizes all modules seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Learn */}
          <div className="text-center">
            <div className="bg-harmony-cream/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-harmony-dark" />
            </div>
            <h3 className="text-2xl font-bold text-harmony-dark mb-4">Automated Training</h3>
            <p className="text-gray-600 text-lg">
              Automated campaigns for phishing, smishing, vishing. Auto-Pilot runs recurring campaigns without manual intervention.
            </p>
          </div>

          {/* Build */}
          <div className="text-center">
            <div className="bg-harmony-cream/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Wrench className="h-10 w-10 text-harmony-dark" />
            </div>
            <h3 className="text-2xl font-bold text-harmony-dark mb-4">Unified Dashboard</h3>
            <p className="text-gray-600 text-lg">
              Centralized dashboard for campaign results, training progress, risk evaluations, and real-time reporting.
            </p>
          </div>

          {/* Connect */}
          <div className="text-center">
            <div className="bg-harmony-cream/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Users className="h-10 w-10 text-harmony-dark" />
            </div>
            <h3 className="text-2xl font-bold text-harmony-dark mb-4">User Administration</h3>
            <p className="text-gray-600 text-lg">
              Automated enrollment of new hires and high-risk groups. SAML 2.0 SSO, 2FA, and role-based access control.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
