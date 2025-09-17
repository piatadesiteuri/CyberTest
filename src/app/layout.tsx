import './globals.css'
import { Inter } from 'next/font/google'
import { ChakraUIProvider } from '@/providers/ChakraProvider'
import { AuthProvider } from '@/contexts/AuthContext'

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
        <ChakraUIProvider>
          <AuthProvider>
            <div className="min-h-screen">
              {children}
            </div>
          </AuthProvider>
        </ChakraUIProvider>
      </body>
    </html>
  )
}
