'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Clock, CheckCircle, RotateCcw, Target, AlertCircle, Lock } from 'lucide-react'

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
  const [unlockStatus, setUnlockStatus] = useState<{
    isUnlocked: boolean;
    reason?: string;
    requiredProgress?: number;
    currentProgress?: number;
  } | null>(null)
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
    // Check quiz unlock status first (only for authenticated users)
    const checkQuizUnlock = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, skip unlock check and proceed to load quiz
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:3001/api/progress/quiz/${quizId}/unlock`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const unlockData = await response.json();
          setUnlockStatus(unlockData.data);
          
          if (!unlockData.data.isUnlocked) {
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error checking quiz unlock status:', error);
      }
    };

    // Fetch quiz data from API
    const fetchQuiz = async () => {
      try {
        console.log('🎯 Fetching quiz with ID:', quizId);
        const response = await fetch(`http://localhost:3001/api/courses/${courseId}`);
        const data = await response.json();
        
        if (data.success && data.course) {
          console.log('📊 Course data received:', data.course);
          
          // Find the quiz in the course modules
          let foundQuiz = null;
          for (const module of data.course.modules) {
            if (module.quiz && module.quiz.id === quizId) {
              foundQuiz = module.quiz;
              break;
            }
          }
          
          if (foundQuiz) {
            console.log('✅ Quiz found:', foundQuiz.title);
            console.log('❓ Questions count:', foundQuiz.questions.length);
            setQuiz(foundQuiz);
            setTimeLeft((foundQuiz.timeLimit || 15) * 60); // Convert minutes to seconds
          } else {
            console.log('❌ Quiz not found in course modules');
            // Fallback to mock data
            setQuiz(mockQuiz);
            setTimeLeft(15 * 60);
          }
        } else {
          console.log('❌ Failed to fetch course data, using mock data');
          setQuiz(mockQuiz);
          setTimeLeft(15 * 60);
        }
      } catch (error) {
        console.error('❌ Error fetching quiz:', error);
        setQuiz(mockQuiz);
        setTimeLeft(15 * 60);
      } finally {
        setLoading(false);
      }
    };

    checkQuizUnlock().then(() => {
      fetchQuiz();
    });
  }, [courseId, quizId]);

  // Mock data as fallback
  const mockQuiz: Quiz = {
    id: quizId as string,
    title: 'Cybersecurity Fundamentals Quiz',
    description: 'Test your understanding of basic cybersecurity concepts',
    timeLimit: 15, // 15 minutes
    passingScore: 70,
    maxAttempts: 3,
    questions: []
  };

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
    setTimeLeft((quiz?.timeLimit || 15) * 60)
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

  // Show locked quiz message
  if (unlockStatus && !unlockStatus.isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Locked</h2>
          <p className="text-gray-600 mb-6">{unlockStatus.reason}</p>
          
          {unlockStatus.requiredProgress && unlockStatus.currentProgress !== undefined && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress Required</span>
                <span>{unlockStatus.currentProgress}% / {unlockStatus.requiredProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-warm-copper h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((unlockStatus.currentProgress / unlockStatus.requiredProgress) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
          
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

            {/* Quiz Results Summary */}
            <div className="space-y-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900">Quiz Results</h3>
              
              {/* Summary Stats */}
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="text-center">
                  <div className="text-6xl font-bold text-warm-copper mb-4">
                    {quiz.questions.filter((question, index) => {
                      const userAnswer = answers[question.id]
                      const correctAnswer = question.answers.find(a => a.isCorrect)
                      return question.type === 'multiple_choice' 
                        ? question.answers.filter(a => a.isCorrect).every(a => 
                            Array.isArray(userAnswer) && userAnswer.includes(a.text)
                          ) && question.answers.filter(a => a.isCorrect).length === (Array.isArray(userAnswer) ? userAnswer.length : 0)
                        : userAnswer === correctAnswer?.text
                    }).length}/{quiz.questions.length}
                  </div>
                  <div className="text-lg text-gray-600 mb-2">Correct Answers</div>
                  <div className="text-sm text-gray-500">
                    {quiz.questions.filter((question, index) => {
                      const userAnswer = answers[question.id]
                      const correctAnswer = question.answers.find(a => a.isCorrect)
                      return question.type === 'multiple_choice' 
                        ? question.answers.filter(a => a.isCorrect).every(a => 
                            Array.isArray(userAnswer) && userAnswer.includes(a.text)
                          ) && question.answers.filter(a => a.isCorrect).length === (Array.isArray(userAnswer) ? userAnswer.length : 0)
                        : userAnswer === correctAnswer?.text
                    }).length === quiz.questions.length ? 'Perfect! All answers correct!' : 
                    quiz.questions.filter((question, index) => {
                      const userAnswer = answers[question.id]
                      const correctAnswer = question.answers.find(a => a.isCorrect)
                      return question.type === 'multiple_choice' 
                        ? question.answers.filter(a => a.isCorrect).every(a => 
                            Array.isArray(userAnswer) && userAnswer.includes(a.text)
                          ) && question.answers.filter(a => a.isCorrect).length === (Array.isArray(userAnswer) ? userAnswer.length : 0)
                        : userAnswer === correctAnswer?.text
                    }).length === 0 ? 'Keep studying and try again!' : 'Good effort! Review the material and try again.'}
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
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-500 hover:text-warm-copper transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Dashboard</span>
              </button>
              <div className="h-4 w-px bg-gray-300"></div>
              <button
                onClick={() => router.push(`/learning/${courseId}`)}
                className="flex items-center text-gray-600 hover:text-warm-copper transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
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
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-warm-copper text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {currentQuestionIndex + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Question {currentQuestionIndex + 1}</h3>
                  <p className="text-sm text-gray-500">{currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}% Complete
              </div>
            </div>
            <div className="prose prose-lg max-w-none text-gray-900" 
                 dangerouslySetInnerHTML={{ 
                   __html: currentQuestion.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-warm-copper">$1</strong>')
                                             .replace(/\n/g, '<br/>')
                 }} 
            />
          </div>

          <div className="space-y-3">
            {currentQuestion.answers.map((answer, index) => {
              const isSelected = currentQuestion.type === 'multiple_choice'
                ? Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].includes(answer.text)
                : answers[currentQuestion.id] === answer.text
              
              return (
                <label
                  key={index}
                  className={`block p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-warm-copper bg-gradient-to-r from-warm-copper/5 to-warm-bronze/5 shadow-md' 
                      : 'border-gray-200 hover:border-warm-copper/50 hover:bg-warm-copper/5 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 mt-0.5 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-warm-copper bg-warm-copper' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {isSelected && (
                          <div className="w-2 h-2 bg-warm-copper rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-800 mt-1 leading-relaxed">{answer.text}</p>
                    </div>
                  </div>
                  <input
                    type={currentQuestion.type === 'multiple_choice' ? 'checkbox' : 'radio'}
                    name={`question-${currentQuestion.id}`}
                    value={answer.text}
                    checked={isSelected}
                    onChange={(e) => {
                      if (currentQuestion.type === 'multiple_choice') {
                        const currentAnswers = Array.isArray(answers[currentQuestion.id]) ? answers[currentQuestion.id] as string[] : []
                        if (e.target.checked) {
                          handleAnswerChange(currentQuestion.id, [...currentAnswers, answer.text])
                        } else {
                          handleAnswerChange(currentQuestion.id, currentAnswers.filter((a: string) => a !== answer.text))
                        }
                      } else {
                        handleAnswerChange(currentQuestion.id, answer.text)
                      }
                    }}
                    className="sr-only"
                  />
                </label>
              )
            })}
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
