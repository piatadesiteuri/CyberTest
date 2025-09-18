'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Play, Shield, AlertTriangle, Mail, MessageSquare, Phone, CheckCircle, XCircle, Eye, MousePointer, Download } from 'lucide-react'

interface TutorialStep {
  id: string
  title: string
  description: string
  type: 'phishing' | 'smishing' | 'vishing'
  content: string
  examples: {
    subject: string
    sender: string
    content: string
    redFlags: string[]
  }
  interactive: {
    question: string
    options: string[]
    correct: number
    explanation: string
  }
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'phishing-basics',
    title: 'Ce este Phishing-ul?',
    description: 'Învață să identifici email-urile false și să te protejezi',
    type: 'phishing',
    content: `
      <h2>🎣 Phishing-ul este o tehnică de înșelăciune</h2>
      <p>Atacatorii trimit email-uri false care par să vină de la companii de încredere (bancă, PayPal, Microsoft) pentru a te păcăli să dai informații personale.</p>
      
      <h3>🔴 Semne de avertizare:</h3>
      <ul>
        <li><strong>Urgență excesivă:</strong> "Verifică contul în 24 ore sau va fi suspendat!"</li>
        <li><strong>Greșeli de scriere:</strong> "Verificati contul dvs" în loc de "Verificați contul dvs"</li>
        <li><strong>Link-uri suspecte:</strong> Hover peste link și vezi dacă URL-ul pare fals</li>
        <li><strong>Cereri de informații sensibile:</strong> Parole, date bancare, coduri PIN</li>
      </ul>
    `,
    examples: {
      subject: 'URGENT: Verifică contul în 24 ore!',
      sender: 'security@paypal-verification.com',
      content: 'Contul tău PayPal va fi suspendat dacă nu verifici informațiile în 24 ore. Click aici pentru a continua.',
      redFlags: ['Urgență excesivă', 'Email sender suspect', 'Cerere de verificare urgentă']
    },
    interactive: {
      question: 'Care dintre acestea este cel mai probabil un email de phishing?',
      options: [
        'Email de la banca ta cu "Verifică contul în 24 ore sau va fi suspendat!"',
        'Email de la Netflix cu "Factura ta pentru luna curentă"',
        'Email de la LinkedIn cu "Ai primit o nouă conexiune"',
        'Email de la Amazon cu "Comanda ta a fost livrată"'
      ],
      correct: 0,
      explanation: 'Email-urile cu urgență excesivă și amenințări sunt semne clasice de phishing!'
    }
  },
  {
    id: 'smishing-basics',
    title: 'Ce este Smishing-ul?',
    description: 'Învață să identifici SMS-urile false și să te protejezi',
    type: 'smishing',
    content: `
      <h2>📱 Smishing-ul = SMS + Phishing</h2>
      <p>Atacatorii trimit SMS-uri false care par să vină de la servicii de încredere pentru a te păcăli să dai click pe link-uri sau să răspunzi cu informații personale.</p>
      
      <h3>🔴 Semne de avertizare în SMS:</h3>
      <ul>
        <li><strong>Numere de telefon suspecte:</strong> Nu sunt numere oficiale ale companiei</li>
        <li><strong>Link-uri scurte:</strong> bit.ly, tinyurl.com fără context clar</li>
        <li><strong>Cereri de răspuns rapid:</strong> "Răspunde cu DA pentru a continua"</li>
        <li><strong>Premii false:</strong> "Ai câștigat 1000€! Click aici!"</li>
      </ul>
    `,
    examples: {
      subject: 'SMS: Ai câștigat 1000€!',
      sender: '+40 123 456 789',
      content: 'Felicitări! Ai câștigat 1000€ la loteria națională. Click aici pentru a-ți lua premiul: bit.ly/win1000',
      redFlags: ['Premiu neașteptat', 'Link scurt suspect', 'Număr de telefon necunoscut']
    },
    interactive: {
      question: 'Ce ar trebui să faci când primești un SMS cu "Ai câștigat 1000€"?',
      options: [
        'Să dai click pe link pentru a-ți lua premiul',
        'Să răspunzi cu "DA" pentru a confirma',
        'Să ștergi SMS-ul și să nu răspunzi',
        'Să suni numărul pentru a verifica'
      ],
      correct: 2,
      explanation: 'Niciodată nu răspunde la SMS-uri cu premii neașteptate! Sunt aproape întotdeauna înșelăciuni.'
    }
  },
  {
    id: 'vishing-basics',
    title: 'Ce este Vishing-ul?',
    description: 'Învață să identifici apelurile false și să te protejezi',
    type: 'vishing',
    content: `
      <h2>📞 Vishing-ul = Voice + Phishing</h2>
      <p>Atacatorii sună și se dau drept reprezentanți ai companiilor de încredere pentru a obține informații personale prin telefon.</p>
      
      <h3>🔴 Semne de avertizare în apeluri:</h3>
      <ul>
        <li><strong>Cereri de informații sensibile:</strong> Parole, coduri PIN, date bancare</li>
        <li><strong>Urgență excesivă:</strong> "Trebuie să verifici contul ACUM!"</li>
        <li><strong>Numere de telefon suspecte:</strong> Nu sunt numere oficiale ale companiei</li>
        <li><strong>Cereri de acces la computer:</strong> "Instalează TeamViewer pentru a te ajuta"</li>
      </ul>
    `,
    examples: {
      subject: 'Apel: Verificare cont urgentă',
      sender: '+40 123 456 789',
      content: 'Bună, sun din partea Microsoft. Contul tău a fost compromis. Trebuie să verifici informațiile acum. Pot să te ajut să te conectezi?',
      redFlags: ['Urgență excesivă', 'Cerere de informații sensibile', 'Număr de telefon suspect']
    },
    interactive: {
      question: 'Ce ar trebui să faci când cineva sună și cere parola ta?',
      options: [
        'Să dai parola pentru a verifica identitatea',
        'Să închizi apelul și să suni compania oficială',
        'Să dai doar numele pentru a verifica',
        'Să răspunzi la întrebări pentru a ajuta'
      ],
      correct: 1,
      explanation: 'Niciodată nu da parola prin telefon! Închide apelul și sună tu compania oficială.'
    }
  }
]

export default function PhishingTutorialPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const step = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    
    if (selectedAnswer === step.interactive.correct) {
      setScore(score + 1)
    }
    setShowResult(true)
  }

  const handleNext = () => {
    if (isLastStep) {
      // Tutorial completed
      router.push('/simulations/quiz')
    } else {
      setCurrentStep(currentStep + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phishing':
        return <Mail className="w-6 h-6 text-warm-copper" />
      case 'smishing':
        return <MessageSquare className="w-6 h-6 text-warm-amber" />
      case 'vishing':
        return <Phone className="w-6 h-6 text-warm-bronze" />
      default:
        return <Shield className="w-6 h-6 text-warm-gold" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'phishing':
        return 'bg-warm-copper/10 text-warm-copper border-warm-copper/20'
      case 'smishing':
        return 'bg-warm-amber/10 text-warm-amber border-warm-amber/20'
      case 'vishing':
        return 'bg-warm-bronze/10 text-warm-bronze border-warm-bronze/20'
      default:
        return 'bg-warm-gold/10 text-warm-gold border-warm-gold/20'
    }
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
              <span className="font-medium">Back to Simulations</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {tutorialSteps.length}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-warm-copper h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Step Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {getTypeIcon(step.type)}
            <h1 className="text-3xl font-bold text-gray-900 ml-3">{step.title}</h1>
          </div>
          <p className="text-lg text-gray-600">{step.description}</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getTypeColor(step.type)}`}>
            {step.type.charAt(0).toUpperCase() + step.type.slice(1)}
          </span>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-8">
            <div 
              className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: step.content }}
            />
          </div>
        </div>

        {/* Example */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📧 Exemplu real:</h3>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">From: {step.examples.sender}</span>
              <span className="text-sm text-gray-500">Today</span>
            </div>
            <div className="font-medium text-gray-900 mb-2">Subject: {step.examples.subject}</div>
            <div className="text-gray-700 mb-4">{step.examples.content}</div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-red-600">🔴 Semne de avertizare:</div>
              {step.examples.redFlags.map((flag, index) => (
                <div key={index} className="text-sm text-red-600 flex items-center">
                  <XCircle className="w-4 h-4 mr-2" />
                  {flag}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Quiz */}
        {!showResult ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">🧠 Testează-ți cunoștințele:</h3>
            <div className="space-y-4">
              <p className="text-lg text-gray-700">{step.interactive.question}</p>
              <div className="space-y-3">
                {step.interactive.options.map((option, index) => (
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
              </div>
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-warm-copper text-white py-3 rounded-lg font-medium hover:bg-warm-bronze transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verifică răspunsul
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                selectedAnswer === step.interactive.correct ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {selectedAnswer === step.interactive.correct ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                selectedAnswer === step.interactive.correct ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedAnswer === step.interactive.correct ? 'Corect! 🎉' : 'Greșit! 😔'}
              </h3>
              <p className="text-gray-600">{step.interactive.explanation}</p>
            </div>
            
            <div className="text-center">
              <button
                onClick={handleNext}
                className="bg-warm-copper text-white px-8 py-3 rounded-lg font-medium hover:bg-warm-bronze transition-colors"
              >
                {isLastStep ? 'Finalizează Tutorial-ul' : 'Următorul Pas'}
              </button>
            </div>
          </div>
        )}

        {/* Progress Summary */}
        <div className="mt-8 text-center">
          <div className="text-sm text-gray-500">
            Scor actual: {score} din {currentStep + 1} întrebări
          </div>
        </div>
      </div>
    </div>
  )
}
