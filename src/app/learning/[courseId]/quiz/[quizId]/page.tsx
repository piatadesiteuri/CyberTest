'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Clock, CheckCircle, RotateCcw, Target, AlertCircle } from 'lucide-react'

interface Question {
  id: string
  text: string
  type: 'multiple_choice' | 'single_choice' | 'true_false' | 'fill_in_blank' | 'essay'
  answers: Answer[]
  explanation?: string
  points: number
  order: number
}

interface Answer {
  text: string
  isCorrect: boolean
  explanation?: string
}

interface Quiz {
  id: string
  title: string
  description: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  questions: Question[]
}

interface QuizAttempt {
  id: string
  userId: string
  quizId: string
  answers: { [questionId: string]: string | string[] }
  score: number
  passed: boolean
  timeSpent: number
  completedAt: Date
}

export default function QuizPage() {
  const { courseId, quizId } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: string]: string | string[] }>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizAttempt | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [retakeTimer, setRetakeTimer] = useState(0)
  const [canRetake, setCanRetake] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockQuiz: Quiz = {
      id: quizId as string,
      title: 'Cybersecurity Fundamentals Quiz',
      description: 'Test your understanding of basic cybersecurity concepts',
      timeLimit: 15, // 15 minutes
      passingScore: 70,
      maxAttempts: 3,
      questions: [
        {
          id: 'q1',
          text: 'What does the "C" in the CIA Triad stand for?',
          type: 'single_choice',
          points: 10,
          order: 1,
          answers: [
            { text: 'Confidentiality', isCorrect: true, explanation: 'Confidentiality ensures information is not disclosed to unauthorized individuals.' },
            { text: 'Confidence', isCorrect: false, explanation: 'Confidence is not part of the CIA Triad.' },
            { text: 'Control', isCorrect: false, explanation: 'Control is not part of the CIA Triad.' },
            { text: 'Compliance', isCorrect: false, explanation: 'Compliance is not part of the CIA Triad.' }
          ],
          explanation: 'The CIA Triad consists of Confidentiality, Integrity, and Availability.'
        },
        {
          id: 'q2',
          text: 'Which of the following is NOT a type of malware?',
          type: 'single_choice',
          points: 10,
          order: 2,
          answers: [
            { text: 'Virus', isCorrect: false, explanation: 'Viruses are a type of malware.' },
            { text: 'Firewall', isCorrect: true, explanation: 'A firewall is a security device, not malware.' },
            { text: 'Trojan', isCorrect: false, explanation: 'Trojans are a type of malware.' },
            { text: 'Ransomware', isCorrect: false, explanation: 'Ransomware is a type of malware.' }
          ],
          explanation: 'A firewall is a security device that monitors and controls network traffic, not malicious software.'
        },
        {
          id: 'q3',
          text: 'Phishing is a type of social engineering attack.',
          type: 'true_false',
          points: 10,
          order: 3,
          answers: [
            { text: 'True', isCorrect: true, explanation: 'Phishing uses psychological manipulation to trick people.' },
            { text: 'False', isCorrect: false, explanation: 'Phishing is indeed a social engineering technique.' }
          ],
          explanation: 'Phishing is a social engineering attack that uses fraudulent communications to trick people into revealing sensitive information.'
        },
        {
          id: 'q4',
          text: 'What are the three main components of the CIA Triad? (Select all that apply)',
          type: 'multiple_choice',
          points: 15,
          order: 4,
          answers: [
            { text: 'Confidentiality', isCorrect: true, explanation: 'Confidentiality is one of the three components.' },
            { text: 'Integrity', isCorrect: true, explanation: 'Integrity is one of the three components.' },
            { text: 'Availability', isCorrect: true, explanation: 'Availability is one of the three components.' },
            { text: 'Authentication', isCorrect: false, explanation: 'Authentication is not part of the CIA Triad.' }
          ],
          explanation: 'The CIA Triad consists of Confidentiality, Integrity, and Availability.'
        },
        {
          id: 'q5',
          text: 'A strong password should contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters.',
          type: 'true_false',
          points: 10,
          order: 5,
          answers: [
            { text: 'True', isCorrect: true, explanation: 'Strong passwords should include multiple character types.' },
            { text: 'False', isCorrect: false, explanation: 'This is indeed a characteristic of strong passwords.' }
          ],
          explanation: 'Strong passwords should be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.'
        }
      ]
    }

    setQuiz(mockQuiz)
    setTimeLeft(mockQuiz.timeLimit * 60) // Convert to seconds
    setRetakeTimer(15 * 60) // 15 minutes for retake
    setLoading(false)
  }, [quizId])

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit()
    }
  }, [timeLeft, isSubmitted])

  // Retake timer
  useEffect(() => {
    if (retakeTimer > 0 && !canRetake) {
      const timer = setTimeout(() => {
        setRetakeTimer(retakeTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (retakeTimer === 0 && !canRetake) {
      setCanRetake(true)
    }
  }, [retakeTimer, canRetake])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const calculateScore = () => {
    if (!quiz) return 0

    let totalPoints = 0
    let earnedPoints = 0

    quiz.questions.forEach(question => {
      totalPoints += question.points
      const userAnswer = answers[question.id]
      
      if (question.type === 'multiple_choice') {
        const correctAnswers = question.answers.filter(a => a.isCorrect).map(a => a.text)
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : []
        
        if (correctAnswers.length === userAnswers.length && 
            correctAnswers.every(answer => userAnswers.includes(answer))) {
          earnedPoints += question.points
        }
      } else {
        const correctAnswer = question.answers.find(a => a.isCorrect)
        if (correctAnswer && userAnswer === correctAnswer.text) {
          earnedPoints += question.points
        }
      }
    })

    return Math.round((earnedPoints / totalPoints) * 100)
  }

  const handleSubmit = async () => {
    if (!quiz || !user) return

    const score = calculateScore()
    const passed = score >= quiz.passingScore
    const timeSpent = (quiz.timeLimit * 60) - timeLeft

    const result: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      userId: user.id,
      quizId: quiz.id,
      answers,
      score,
      passed,
      timeSpent,
      completedAt: new Date()
    }

    try {
      // TODO: Replace with actual API call
      console.log('Submitting quiz:', result)
      
      // await learningService.createQuizAttempt(result)
      
      setQuizResult(result)
      setIsSubmitted(true)
      setShowResults(true)
      setAttempts(prev => prev + 1)
      
      // Start retake timer if failed
      if (!passed) {
        setCanRetake(false)
        setRetakeTimer(15 * 60) // 15 minutes
      }
      
    } catch (error) {
      console.error('Error submitting quiz:', error)
    }
  }

  const handleRetake = () => {
    if (!canRetake) return
    
    setAnswers({})
    setCurrentQuestionIndex(0)
    setTimeLeft(quiz?.timeLimit * 60 || 0)
    setIsSubmitted(false)
    setShowResults(false)
    setQuizResult(null)
    setCanRetake(false)
    setRetakeTimer(15 * 60) // Reset retake timer
  }

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleFinish = () => {
    router.push(`/learning/${courseId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-copper mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz not found</h1>
          <p className="text-gray-600 mb-6">The quiz you're looking for doesn't exist.</p>
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

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  if (showResults && quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
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
                  <h1 className="text-xl font-bold text-gray-900">Quiz Results</h1>
                  <p className="text-sm text-gray-600">{quiz.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* Results Summary */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                quizResult.passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {quizResult.passed ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${
                quizResult.passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {quizResult.passed ? 'Congratulations!' : 'Try Again'}
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                You scored {quizResult.score}% (Required: {quiz.passingScore}%)
              </p>
              <p className="text-gray-500">
                Time spent: {formatTime(quizResult.timeSpent)} | 
                Attempts: {attempts} / {quiz.maxAttempts}
              </p>
            </div>

            {/* Question Results - Only show correct count */}
            <div className="space-y-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900">Quiz Summary</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-warm-copper">
                      {quiz.questions.filter((question, index) => {
                        const userAnswer = answers[question.id]
                        const correctAnswer = question.answers.find(a => a.isCorrect)
                        return question.type === 'multiple_choice' 
                          ? question.answers.filter(a => a.isCorrect).every(a => 
                              Array.isArray(userAnswer) && userAnswer.includes(a.text)
                            ) && question.answers.filter(a => a.isCorrect).length === (Array.isArray(userAnswer) ? userAnswer.length : 0)
                          : userAnswer === correctAnswer?.text
                      }).length}
                    </div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-600">
                      {quiz.questions.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Questions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              {!quizResult.passed && attempts < quiz.maxAttempts && (
                <button
                  onClick={handleRetake}
                  disabled={!canRetake}
                  className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
                    canRetake 
                      ? 'bg-warm-copper text-white hover:bg-warm-bronze' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>
                    {canRetake ? 'Retake Quiz' : `Retake in ${formatTime(retakeTimer)}`}
                  </span>
                </button>
              )}
              <button
                onClick={handleFinish}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Course
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
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
                <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
                <p className="text-sm text-gray-600">{quiz.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span className={timeLeft < 60 ? 'text-red-600 font-bold' : ''}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Target className="w-4 h-4" />
                <span>{quiz.passingScore}% to pass</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </h2>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-warm-copper h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {currentQuestion.text}
          </h3>

          <div className="space-y-4">
            {currentQuestion.answers.map((answer, index) => (
              <label
                key={index}
                className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                  (Array.isArray(answers[currentQuestion.id]) 
                    ? answers[currentQuestion.id].includes(answer.text)
                    : answers[currentQuestion.id] === answer.text)
                    ? 'border-warm-copper bg-warm-copper/10'
                    : 'border-gray-200 hover:border-warm-copper/50'
                }`}
              >
                <input
                  type={currentQuestion.type === 'multiple_choice' ? 'checkbox' : 'radio'}
                  name={`question-${currentQuestion.id}`}
                  value={answer.text}
                  checked={
                    currentQuestion.type === 'multiple_choice'
                      ? Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].includes(answer.text)
                      : answers[currentQuestion.id] === answer.text
                  }
                  onChange={(e) => {
                    if (currentQuestion.type === 'multiple_choice') {
                      const currentAnswers = Array.isArray(answers[currentQuestion.id]) ? answers[currentQuestion.id] : []
                      if (e.target.checked) {
                        handleAnswerChange(currentQuestion.id, [...currentAnswers, answer.text])
                      } else {
                        handleAnswerChange(currentQuestion.id, currentAnswers.filter(a => a !== answer.text))
                      }
                    } else {
                      handleAnswerChange(currentQuestion.id, answer.text)
                    }
                  }}
                  className="sr-only"
                />
                <span className="text-gray-900">{answer.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-warm-copper transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-4">
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-warm-copper text-white px-8 py-3 rounded-lg hover:bg-warm-bronze transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Submit Quiz</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-warm-copper text-white px-6 py-3 rounded-lg hover:bg-warm-bronze transition-colors"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
