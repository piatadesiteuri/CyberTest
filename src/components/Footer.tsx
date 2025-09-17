'use client'

import { Shield, Github, MessageCircle, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-harmony-dark text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">CyberTest</span>
            </div>
            <p className="text-harmony-cream text-sm mb-6">
              All-in-One cybersecurity training platform delivered by S.C. ITC GLOBAL DIGITAL CONCEPT S.R.L.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-harmony-cream hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-harmony-cream hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-harmony-cream hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-harmony-cream hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-bold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-harmony-cream">
              <li><a href="#" className="hover:text-white transition-colors">Training Programs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Social Engineering</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reporting</a></li>
            </ul>
          </div>

          {/* Integration */}
          <div>
            <h3 className="font-bold mb-4">Integration</h3>
            <ul className="space-y-2 text-sm text-harmony-cream">
              <li><a href="#" className="hover:text-white transition-colors">Active Directory</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SAML 2.0 SSO</a></li>
              <li><a href="#" className="hover:text-white transition-colors">DEER Systems</a></li>
              <li><a href="#" className="hover:text-white transition-colors">APIs & Webhooks</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-harmony-cream">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Professional Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Sales</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Implementation Guide</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-harmony-cream text-sm mb-4 md:mb-0">
              © 2025 CyberTest. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-harmony-cream">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
