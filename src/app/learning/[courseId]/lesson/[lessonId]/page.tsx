'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { BookOpen, Clock, CheckCircle, ArrowLeft, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string
  content: string
  type: 'theory' | 'practical' | 'video' | 'interactive' | 'documentation'
  order: number
  estimatedDuration: number
  userProgress?: {
    status: 'not_started' | 'in_progress' | 'completed'
    completedAt?: string
    timeSpent?: number
  }
}

interface Course {
  id: string
  title: string
  modules: Module[]
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
  order: number
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCourse: Course = {
      id: courseId as string,
      title: 'Cybersecurity Fundamentals',
      modules: [
        {
          id: '1',
          title: 'Introduction to Cybersecurity',
          order: 1,
          lessons: [
            {
              id: '1-1',
              title: 'What is Cybersecurity?',
              description: 'Introduction to cybersecurity concepts and importance',
              content: `
# What is Cybersecurity?

Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.

## Key Concepts

### The CIA Triad
- **Confidentiality**: Ensuring that information is not disclosed to unauthorized individuals
- **Integrity**: Maintaining the accuracy and completeness of information
- **Availability**: Ensuring that information and resources are available when needed

### Common Threats
- Malware (viruses, trojans, ransomware)
- Phishing attacks
- Social engineering
- Data breaches
- Insider threats

## Why Cybersecurity Matters

In today's digital world, cybersecurity is more important than ever. Organizations face an increasing number of sophisticated cyber threats that can result in:
- Financial losses
- Reputation damage
- Legal consequences
- Operational disruption

## Best Practices

1. **Keep software updated** - Regular updates patch security vulnerabilities
2. **Use strong passwords** - Complex passwords with special characters
3. **Enable two-factor authentication** - Additional layer of security
4. **Be cautious with emails** - Don't click suspicious links
5. **Regular backups** - Protect your data from ransomware
              `,
              type: 'theory',
              order: 1,
              estimatedDuration: 30,
              userProgress: { status: 'completed', completedAt: '2024-01-15', timeSpent: 28 }
            },
            {
              id: '1-2',
              title: 'Types of Cyber Threats',
              description: 'Understanding different categories of cyber threats',
              content: `
# Types of Cyber Threats

## Malware
Malicious software designed to damage or gain unauthorized access to computer systems.

### Common Types:
- **Viruses**: Self-replicating programs that attach to legitimate files
- **Trojans**: Malicious programs disguised as legitimate software
- **Ransomware**: Malware that encrypts files and demands payment for decryption
- **Spyware**: Software that secretly monitors user activity

## Social Engineering
Psychological manipulation to trick people into revealing sensitive information.

### Common Techniques:
- **Phishing**: Fraudulent emails or messages
- **Pretexting**: Creating false scenarios to obtain information
- **Baiting**: Offering something enticing to lure victims
- **Quid pro quo**: Offering something in exchange for information

## Network Attacks
Attacks targeting network infrastructure and communications.

### Common Types:
- **DDoS**: Distributed Denial of Service attacks
- **Man-in-the-Middle**: Intercepting communications
- **DNS Spoofing**: Redirecting traffic to malicious sites

## Prevention Strategies

1. **Antivirus Software**: Keep it updated and running
2. **Firewalls**: Monitor and control network traffic
3. **User Training**: Educate employees about threats
4. **Regular Updates**: Patch vulnerabilities promptly
5. **Access Controls**: Limit user permissions
              `,
              type: 'theory',
              order: 2,
              estimatedDuration: 45,
              userProgress: { status: 'completed', completedAt: '2024-01-15', timeSpent: 42 }
            },
            {
              id: '1-3',
              title: 'Security Best Practices',
              description: 'Fundamental security practices everyone should follow',
              content: `
# Security Best Practices

## Password Security
- Use strong, unique passwords for each account
- Enable two-factor authentication (2FA) when available
- Use a password manager to store passwords securely
- Never share passwords with others

## Software Updates
- Keep operating systems and software up to date
- Enable automatic updates when possible
- Install security patches promptly
- Remove unused software and applications

## Safe Browsing
- Be cautious when clicking links in emails
- Verify website URLs before entering sensitive information
- Use HTTPS websites when possible
- Avoid downloading software from untrusted sources

## Data Protection
- Regularly backup important data
- Use encryption for sensitive information
- Be mindful of what information you share online
- Follow your organization's data handling policies

## Physical Security
- Lock your computer when stepping away
- Don't leave sensitive documents unattended
- Use privacy screens in public places
- Secure mobile devices with passcodes

## Incident Response
- Report suspicious activity immediately
- Know your organization's security procedures
- Keep contact information for IT support handy
- Document any security incidents
              `,
              type: 'practical',
              order: 3,
              estimatedDuration: 45,
              userProgress: { status: 'in_progress', timeSpent: 15 }
            }
          ]
        }
      ]
    }

    if (course) {
      const foundLesson = course.modules
        .flatMap(module => module.lessons)
        .find(l => l.id === lessonId)

      if (foundLesson) {
        setLesson(foundLesson)
        setCourse(course)
        setTimeSpent(foundLesson.userProgress?.timeSpent || 0)
        setIsCompleted(foundLesson.userProgress?.status === 'completed')
      }
    }
    
    setLoading(false)
  }, [courseId, lessonId])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, isCompleted])

  const handleComplete = async () => {
    if (!lesson || !user) return

    try {
      // TODO: Replace with actual API call
      console.log('Completing lesson:', lesson.id, 'for user:', user.id)
      
      setIsCompleted(true)
      setIsPlaying(false)
      
      // Here you would save to database:
      // await learningService.updateUserProgress({
      //   userId: user.id,
      //   lessonId: lesson.id,
      //   status: 'completed',
      //   timeSpent: timeSpent
      // })
      
    } catch (error) {
      console.error('Error completing lesson:', error)
    }
  }

  const handleNext = () => {
    if (!course) return

    const allLessons = course.modules.flatMap(module => module.lessons)
    const currentIndex = allLessons.findIndex(l => l.id === lessonId)
    const nextLesson = allLessons[currentIndex + 1]

    if (nextLesson) {
      router.push(`/learning/${courseId}/lesson/${nextLesson.id}`)
    } else {
      // Go to quiz or next module
      router.push(`/learning/${courseId}/quiz/fundamentals-quiz`)
    }
  }

  const handlePrevious = () => {
    if (!course) return

    const allLessons = course.modules.flatMap(module => module.lessons)
    const currentIndex = allLessons.findIndex(l => l.id === lessonId)
    const previousLesson = allLessons[currentIndex - 1]

    if (previousLesson) {
      router.push(`/learning/${courseId}/lesson/${previousLesson.id}`)
    } else {
      router.push(`/learning/${courseId}`)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-copper mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h1>
          <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push(`/learning/${courseId}`)}
            className="bg-warm-copper text-white px-6 py-2 rounded-lg hover:bg-warm-bronze transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/learning/${courseId}`)}
                className="flex items-center text-gray-600 hover:text-warm-copper transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Course
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-600">{lesson.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeSpent)} / {lesson.estimatedDuration} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 capitalize">{lesson.type}</span>
                {isCompleted && <CheckCircle className="w-5 h-5 text-warm-copper" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Lesson Content */}
          <div className="p-8">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br>') }} />
            </div>
          </div>

          {/* Lesson Controls */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center space-x-2 bg-warm-copper text-white px-4 py-2 rounded-lg hover:bg-warm-bronze transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                
                <button
                  onClick={() => setTimeSpent(0)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-warm-copper transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePrevious}
                  className="flex items-center space-x-2 text-gray-600 hover:text-warm-copper transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {!isCompleted ? (
                  <button
                    onClick={handleComplete}
                    className="bg-warm-copper text-white px-6 py-2 rounded-lg hover:bg-warm-bronze transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Complete</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="bg-warm-copper text-white px-6 py-2 rounded-lg hover:bg-warm-bronze transition-colors flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
