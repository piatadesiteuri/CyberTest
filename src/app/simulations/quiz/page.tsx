'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trophy, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  type: 'phishing' | 'smishing' | 'vishing'
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Primești un email de la "security@paypal-verification.com" care spune "Verifică contul în 24 ore sau va fi suspendat!". Ce faci?',
    options: [
      'Dai click pe link pentru a verifica contul',
      'Ștergi email-ul și nu răspunzi',
      'Răspunzi cu informațiile tale personale',
      'Forwardezi email-ul la toți colegii'
    ],
    correct: 1,
    explanation: 'Email-urile cu urgență excesivă și sender-uri suspecte sunt semne clasice de phishing!',
    type: 'phishing'
  },
  {
    id: 'q2',
    question: 'Primești un SMS cu "Ai câștigat 1000€! Click aici: bit.ly/win1000". Ce faci?',
    options: [
      'Dai click pe link pentru a-ți lua premiul',
      'Răspunzi cu "DA" pentru a confirma',
      'Ștergi SMS-ul și nu răspunzi',
      'Sun numărul pentru a verifica'
    ],
    correct: 2,
    explanation: 'SMS-urile cu premii neașteptate sunt aproape întotdeauna înșelăciuni!',
    type: 'smishing'
  },
  {
    id: 'q3',
    question: 'Cineva sună și spune că este de la Microsoft și cere parola ta pentru a "verifica contul". Ce faci?',
    options: [
      'Dai parola pentru a verifica identitatea',
      'Închizi apelul și suni Microsoft oficial',
      'Dai doar numele pentru a verifica',
      'Răspunzi la întrebări pentru a ajuta'
    ],
    correct: 1,
    explanation: 'Niciodată nu da parola prin telefon! Închide apelul și sună tu compania oficială.',
    type: 'vishing'
  },
  {
    id: 'q4',
    question: 'Care dintre acestea este cel mai probabil un email de phishing?',
    options: [
      'Email de la Netflix cu "Factura ta pentru luna curentă"',
      'Email de la LinkedIn cu "Ai primit o nouă conexiune"',
      'Email cu "URGENT: Verifică contul în 24 ore sau va fi suspendat!"',
      'Email de la Amazon cu "Comanda ta a fost livrată"'
    ],
    correct: 2,
    explanation: 'Email-urile cu urgență excesivă și amenințări sunt semne clasice de phishing!',
    type: 'phishing'
  },
  {
    id: 'q5',
    question: 'Primești un SMS cu "Contul tău bancar a fost suspendat. Sună imediat: +40 123 456 789". Ce faci?',
    options: [
      'Sun numărul pentru a rezolva problema',
      'Ștergi SMS-ul și sun banca oficială',
      'Răspunzi cu "DA" pentru a confirma',
      'Forwardezi SMS-ul la toți prietenii'
    ],
    correct: 1,
    explanation: 'Niciodată nu suna numere din SMS-uri suspecte! Sună tu banca oficială.',
    type: 'smishing'
  }
]

export default function PhishingQuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)

  const question = quizQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === quizQuestions.length - 1

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setShowResult(true)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      setQuizCompleted(true)
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setAnswers([])
    setQuizCompleted(false)
  }

  const getScore = () => {
    return answers.filter((answer, index) => answer === quizQuestions[index].correct).length
  }

  const getScorePercentage = () => {
    return Math.round((getScore() / quizQuestions.length) * 100)
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 80) return 'Excelent! Ești foarte bine pregătit! 🎉'
    if (percentage >= 60) return 'Bun! Mai ai puțin de învățat. 📚'
    return 'Trebuie să studiezi mai mult despre securitate! 🔒'
  }

  if (quizCompleted) {
    const score = getScore()
    const percentage = getScorePercentage()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-harmony-cream via-white to-harmony-tan">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-warm-copper to-warm-bronze rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Completat! 🎉</h1>
            <p className="text-xl text-gray-600 mb-8">Felicitări! Ai terminat testul de securitate cibernetică.</p>
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)}`}>
                  {percentage}%
                </div>
                <p className="text-2xl font-semibold text-gray-900 mb-2">
                  {score} din {quizQuestions.length} întrebări corecte
                </p>
                <p className={`text-lg ${getScoreColor(percentage)}`}>
                  {getScoreMessage(percentage)}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-warm-copper mb-2">{score}</div>
                  <div className="text-gray-600">Răspunsuri Corecte</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warm-amber mb-2">{quizQuestions.length - score}</div>
                  <div className="text-gray-600">Răspunsuri Greșite</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warm-bronze mb-2">{percentage}%</div>
                  <div className="text-gray-600">Scor Final</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rezumatul răspunsurilor tale:</h3>
                {quizQuestions.map((q, index) => (
                  <div key={q.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {answers[index] === q.correct ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mr-3" />
                      )}
                      <span className="text-gray-700">Întrebarea {index + 1}</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      answers[index] === q.correct ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {answers[index] === q.correct ? 'Corect' : 'Greșit'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRestart}
                className="bg-warm-copper text-white px-6 py-3 rounded-lg font-medium hover:bg-warm-bronze transition-colors flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Refă Quiz-ul
              </button>
              
              <button
                onClick={() => router.push('/simulations')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Înapoi la Tutorial-uri
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-warm-amber text-white px-6 py-3 rounded-lg font-medium hover:bg-warm-bronze transition-colors flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
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
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/simulations')}
              className="flex items-center text-gray-600 hover:text-warm-copper transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Tutorials</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-warm-copper h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.question}</h1>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              question.type === 'phishing' ? 'bg-warm-copper/10 text-warm-copper' :
              question.type === 'smishing' ? 'bg-warm-amber/10 text-warm-amber' :
              'bg-warm-bronze/10 text-warm-bronze'
            }`}>
              {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
            </span>
          </div>
          
          {!showResult ? (
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    selectedAnswer === index
                      ? 'border-warm-copper bg-warm-copper/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-warm-copper bg-warm-copper'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </button>
              ))}
              
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-warm-copper text-white py-3 rounded-lg font-medium hover:bg-warm-bronze transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verifică răspunsul
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                selectedAnswer === question.correct ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {selectedAnswer === question.correct ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                selectedAnswer === question.correct ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedAnswer === question.correct ? 'Corect! 🎉' : 'Greșit! 😔'}
              </h3>
              <p className="text-gray-600 mb-6">{question.explanation}</p>
              
              <button
                onClick={handleNext}
                className="bg-warm-copper text-white px-8 py-3 rounded-lg font-medium hover:bg-warm-bronze transition-colors"
              >
                {isLastQuestion ? 'Finalizează Quiz-ul' : 'Următoarea Întrebare'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
