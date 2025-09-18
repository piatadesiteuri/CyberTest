import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import ToastContainer from '@/components/ui/ToastContainer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CyberTest - Cybersecurity Training Platform',
  description: 'All-in-One Cybersecurity Training and Awareness Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <AuthProvider>
            <div className="min-h-screen">
              {children}
            </div>
            <ToastContainer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
