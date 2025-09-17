'use client'

import { Heart, Users, Globe } from 'lucide-react'

export default function SupportSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 harmony-gradient">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Professional Services
          </h2>
          <p className="text-xl text-harmony-cream max-w-3xl mx-auto">
            Delivered by S.C. ITC GLOBAL DIGITAL CONCEPT S.R.L. - Complete implementation and support for your cybersecurity training needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-white/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Built-in Automation</h3>
            <p className="text-harmony-cream">
              Automated initial configuration, user import, group definition, and standard campaign setup.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Professional Services</h3>
            <p className="text-harmony-cream">
              Assisted implementation, platform personalization, and full initial configuration.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/20 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Globe className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Rapid Onboarding</h3>
            <p className="text-harmony-cream">
              Full implementation within 1 week from subscription activation with dedicated support.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-harmony-dark hover:bg-harmony-cream font-bold py-3 px-8 rounded-lg transition-colors">
            Learn more
          </button>
          <button className="bg-harmony-tan text-white hover:bg-harmony-dark font-bold py-3 px-8 rounded-lg transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  )
}
