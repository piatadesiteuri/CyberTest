'use client'

import { Star, Quote } from 'lucide-react'

const successStories = [
  {
    name: 'Maria Popescu',
    role: 'IT Security Manager',
    company: 'TechCorp Romania',
    story: 'CyberTest\'s automated campaigns reduced our phishing click rates by 85% in just 3 months. The centralized dashboard gives us complete visibility into our security posture.',
    rating: 5,
    image: 'MP'
  },
  {
    name: 'Alexandru Ionescu',
    role: 'CISO',
    company: 'BankSecure',
    story: 'The integration with our Active Directory and automated user enrollment saved us hundreds of hours. New employees are automatically enrolled in appropriate training programs.',
    rating: 5,
    image: 'AI'
  },
  {
    name: 'Ana Dumitrescu',
    role: 'HR Director',
    company: 'DataGuard Solutions',
    story: 'The multilingual content and role-based training allocation made it easy to implement across our diverse workforce. Compliance reporting is now automated and comprehensive.',
    rating: 5,
    image: 'AD'
  },
  {
    name: 'Cristian Radu',
    role: 'Security Operations Manager',
    company: 'CyberShield Technologies',
    story: 'The Auto-Pilot feature runs our recurring campaigns without manual intervention. We can focus on strategic security initiatives while the platform handles routine training.',
    rating: 5,
    image: 'CR'
  }
]

export default function SuccessStories() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-harmony-dark mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of organizations that have enhanced their cybersecurity posture with our All-in-One platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {successStories.map((story, index) => (
            <div key={index} className="card relative">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="bg-harmony-dark text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                  {story.image}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-harmony-dark">{story.name}</h3>
                      <p className="text-sm text-gray-600">{story.role} at {story.company}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-6 w-6 text-harmony-cream/30" />
                    <p className="text-gray-700 italic pl-4">
                      "{story.story}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="text-harmony-dark hover:text-harmony-tan font-medium">
            Read more success stories →
          </button>
        </div>
      </div>
    </section>
  )
}
