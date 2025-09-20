'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Save, Move, Eye } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Answer {
  text: string
  isCorrect: boolean
  explanation?: string
}

interface Question {
  id: string
  text: string
  type: 'multiple_choice' | 'true_false' | 'single_choice' | 'fill_in_blank' | 'essay'
  answers: Answer[]
  explanation: string
  points: number
  order: number
}

interface QuizModalProps {
  moduleId: string
  onClose: () => void
  onQuizCreated: (quiz: any) => void
}

export default function QuizModal({ moduleId, onClose, onQuizCreated }: QuizModalProps) {
  const [currentStep, setCurrentStep] = useState<'basic' | 'questions' | 'preview'>('basic')
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    type: 'practice' as 'pre_assessment' | 'post_assessment' | 'practice' | 'final_exam',
    timeLimit: 0,
    passingScore: 70,
    maxAttempts: 3
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const quizTypes = [
    { value: 'practice', label: 'Practice Quiz', description: 'Practice questions for learning' },
    { value: 'pre_assessment', label: 'Pre-Assessment', description: 'Test knowledge before learning' },
    { value: 'post_assessment', label: 'Post-Assessment', description: 'Test knowledge after learning' },
    { value: 'final_exam', label: 'Final Exam', description: 'Comprehensive final examination' }
  ]

  const questionTypes = [
    { value: 'single_choice', label: 'Single Choice', description: 'One correct answer' },
    { value: 'multiple_choice', label: 'Multiple Choice', description: 'Multiple correct answers' },
    { value: 'true_false', label: 'True/False', description: 'Binary choice question' },
    { value: 'fill_in_blank', label: 'Fill in the Blank', description: 'Text input answer' },
    { value: 'essay', label: 'Essay', description: 'Long form written answer' }
  ]

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      type: 'single_choice',
      answers: [
        { text: '', isCorrect: true, explanation: '' },
        { text: '', isCorrect: false, explanation: '' }
      ],
      explanation: '',
      points: 10,
      order: questions.length + 1
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ))
  }

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId))
  }

  const addAnswer = (questionId: string) => {
    const question = questions.find(q => q.id === questionId)
    if (question) {
      const newAnswers = [...question.answers, { text: '', isCorrect: false, explanation: '' }]
      updateQuestion(questionId, { answers: newAnswers })
    }
  }

  const updateAnswer = (questionId: string, answerIndex: number, updates: Partial<Answer>) => {
    const question = questions.find(q => q.id === questionId)
    if (question) {
      const newAnswers = question.answers.map((answer, index) =>
        index === answerIndex ? { ...answer, ...updates } : answer
      )
      updateQuestion(questionId, { answers: newAnswers })
    }
  }

  const deleteAnswer = (questionId: string, answerIndex: number) => {
    const question = questions.find(q => q.id === questionId)
    if (question && question.answers.length > 2) {
      const newAnswers = question.answers.filter((_, index) => index !== answerIndex)
      updateQuestion(questionId, { answers: newAnswers })
    }
  }

  const handleSubmit = async () => {
    if (questions.length === 0) {
      showToast('Please add at least one question', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      // First create the quiz
      const quizResponse = await fetch(`${API_BASE_URL}/api/learning/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId,
          title: quizData.title,
          description: quizData.description,
          type: quizData.type,
          timeLimit: quizData.timeLimit,
          passingScore: quizData.passingScore,
          maxAttempts: quizData.maxAttempts
        })
      })

      if (quizResponse.ok) {
        const quizResult = await quizResponse.json()
        const newQuiz = quizResult.data.quiz

        // Then create questions for the quiz
        for (const question of questions) {
          await fetch(`${API_BASE_URL}/api/learning/questions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quizId: newQuiz.id,
              text: question.text,
              type: question.type,
              answers: question.answers.map(a => ({ text: a.text, isCorrect: a.isCorrect, explanation: a.explanation })),
              explanation: question.explanation,
              points: question.points,
              order: question.order
            })
          })
        }

        onQuizCreated(newQuiz)
        showToast('Quiz created successfully', 'success')
        onClose()
      } else {
        // Fallback for development
        const mockQuiz = {
          id: Date.now().toString(),
          moduleId,
          title: quizData.title,
          description: quizData.description,
          type: quizData.type,
          status: 'draft',
          timeLimit: quizData.timeLimit,
          passingScore: quizData.passingScore,
          maxAttempts: quizData.maxAttempts,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        onQuizCreated(mockQuiz)
        showToast('Quiz created locally', 'warning')
        onClose()
      }
    } catch (error) {
      console.error('Error creating quiz:', error)
      showToast('Failed to create quiz', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-harmony-cream mb-2">Quiz Title</label>
          <input
            type="text"
            required
            value={quizData.title}
            onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
            placeholder="Enter quiz title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-harmony-cream mb-2">Quiz Type</label>
          <select
            value={quizData.type}
            onChange={(e) => setQuizData({ ...quizData, type: e.target.value as any })}
            className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
          >
            {quizTypes.map(type => (
              <option key={type.value} value={type.value} className="bg-harmony-dark">
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-harmony-cream mb-2">Description</label>
        <textarea
          required
          value={quizData.description}
          onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
          placeholder="Brief description of the quiz..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-harmony-cream mb-2">Time Limit (minutes)</label>
          <input
            type="number"
            min="0"
            value={quizData.timeLimit}
            onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            placeholder="0 = No limit"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-harmony-cream mb-2">Passing Score (%)</label>
          <input
            type="number"
            required
            min="0"
            max="100"
            value={quizData.passingScore}
            onChange={(e) => setQuizData({ ...quizData, passingScore: parseInt(e.target.value) || 70 })}
            className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-harmony-cream mb-2">Max Attempts</label>
          <input
            type="number"
            min="0"
            value={quizData.maxAttempts}
            onChange={(e) => setQuizData({ ...quizData, maxAttempts: parseInt(e.target.value) || 3 })}
            className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            placeholder="0 = Unlimited"
          />
        </div>
      </div>

      <div className="bg-purple-600/10 p-4 rounded-lg border border-purple-600/20">
        <h4 className="text-purple-300 font-medium mb-2">
          {quizTypes.find(t => t.value === quizData.type)?.label}
        </h4>
        <p className="text-purple-200/80 text-sm">
          {quizTypes.find(t => t.value === quizData.type)?.description}
        </p>
      </div>
    </div>
  )

  const renderQuestions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-white">Quiz Questions ({questions.length})</h4>
        <button
          onClick={addQuestion}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Question</span>
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-harmony-cream/60">No questions yet. Click "Add Question" to start.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <QuestionEditor
              key={question.id}
              question={question}
              index={index}
              onUpdate={(updates) => updateQuestion(question.id, updates)}
              onDelete={() => deleteQuestion(question.id)}
              onAddAnswer={() => addAnswer(question.id)}
              onUpdateAnswer={(answerIndex, updates) => updateAnswer(question.id, answerIndex, updates)}
              onDeleteAnswer={(answerIndex) => deleteAnswer(question.id, answerIndex)}
            />
          ))}
        </div>
      )}
    </div>
  )

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="bg-white/5 p-6 rounded-lg border border-harmony-cream/20">
        <h3 className="text-xl font-semibold text-white mb-2">{quizData.title}</h3>
        <p className="text-harmony-cream/80 mb-4">{quizData.description}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/5 p-3 rounded">
            <div className="text-harmony-cream/60">Type</div>
            <div className="text-white font-medium">{quizTypes.find(t => t.value === quizData.type)?.label}</div>
          </div>
          <div className="bg-white/5 p-3 rounded">
            <div className="text-harmony-cream/60">Questions</div>
            <div className="text-white font-medium">{questions.length}</div>
          </div>
          <div className="bg-white/5 p-3 rounded">
            <div className="text-harmony-cream/60">Time Limit</div>
            <div className="text-white font-medium">{quizData.timeLimit || 'No limit'}</div>
          </div>
          <div className="bg-white/5 p-3 rounded">
            <div className="text-harmony-cream/60">Passing Score</div>
            <div className="text-white font-medium">{quizData.passingScore}%</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question.id} className="bg-white/5 p-4 rounded-lg border border-harmony-cream/20">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-white font-medium">Question {index + 1} ({question.points} points)</h4>
              <span className="text-harmony-cream/60 text-sm capitalize">{question.type.replace('_', ' ')}</span>
            </div>
            <p className="text-harmony-cream/90 mb-3">{question.text}</p>
            
            <div className="space-y-2">
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className={`p-2 rounded ${answer.isCorrect ? 'bg-green-600/20 border border-green-600/40' : 'bg-white/5 border border-harmony-cream/20'}`}>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${answer.isCorrect ? 'text-green-300' : 'text-harmony-cream/60'}`}>
                      {String.fromCharCode(65 + answerIndex)}.
                    </span>
                    <span className="text-white">{answer.text}</span>
                    {answer.isCorrect && <span className="text-green-300 text-sm">✓ Correct</span>}
                  </div>
                </div>
              ))}
            </div>
            
            {question.explanation && (
              <div className="mt-3 p-3 bg-blue-600/10 border border-blue-600/20 rounded">
                <div className="text-blue-300 text-sm font-medium mb-1">Explanation:</div>
                <div className="text-blue-200/80 text-sm">{question.explanation}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-harmony-cream/20">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Create New Quiz</h3>
            <p className="text-harmony-cream/80 text-sm">Add interactive assessment to your module</p>
          </div>
          <button
            onClick={onClose}
            className="text-harmony-cream hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Navigation */}
        <div className="flex space-x-1 mb-6 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setCurrentStep('basic')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
              currentStep === 'basic' 
                ? 'bg-blue-600 text-white' 
                : 'text-harmony-cream/60 hover:text-white'
            }`}
          >
            1. Basic Info
          </button>
          <button
            onClick={() => setCurrentStep('questions')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
              currentStep === 'questions' 
                ? 'bg-blue-600 text-white' 
                : 'text-harmony-cream/60 hover:text-white'
            }`}
          >
            2. Questions
          </button>
          <button
            onClick={() => setCurrentStep('preview')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
              currentStep === 'preview' 
                ? 'bg-blue-600 text-white' 
                : 'text-harmony-cream/60 hover:text-white'
            }`}
          >
            3. Preview
          </button>
        </div>

        {/* Step Content */}
        <div className="mb-6">
          {currentStep === 'basic' && renderBasicInfo()}
          {currentStep === 'questions' && renderQuestions()}
          {currentStep === 'preview' && renderPreview()}
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex space-x-3">
            {currentStep !== 'basic' && (
              <button
                onClick={() => {
                  if (currentStep === 'questions') setCurrentStep('basic')
                  if (currentStep === 'preview') setCurrentStep('questions')
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Previous
              </button>
            )}

            {currentStep !== 'preview' ? (
              <button
                onClick={() => {
                  if (currentStep === 'basic') setCurrentStep('questions')
                  if (currentStep === 'questions') setCurrentStep('preview')
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Creating...' : 'Create Quiz'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Question Editor Component
interface QuestionEditorProps {
  question: Question
  index: number
  onUpdate: (updates: Partial<Question>) => void
  onDelete: () => void
  onAddAnswer: () => void
  onUpdateAnswer: (answerIndex: number, updates: Partial<Answer>) => void
  onDeleteAnswer: (answerIndex: number) => void
}

function QuestionEditor({ question, index, onUpdate, onDelete, onAddAnswer, onUpdateAnswer, onDeleteAnswer }: QuestionEditorProps) {
  const questionTypes = [
    { value: 'single_choice', label: 'Single Choice' },
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'true_false', label: 'True/False' },
    { value: 'fill_in_blank', label: 'Fill in the Blank' },
    { value: 'essay', label: 'Essay' }
  ]

  return (
    <div className="bg-white/5 p-4 rounded-lg border border-harmony-cream/20">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-white font-medium">Question {index + 1}</h5>
        <div className="flex space-x-2">
          <button
            onClick={onDelete}
            className="text-red-400 hover:text-red-300 transition-colors"
            title="Delete Question"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-harmony-cream mb-1">Question Text</label>
          <textarea
            value={question.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
            placeholder="Enter your question..."
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Type</label>
            <select
              value={question.type}
              onChange={(e) => onUpdate({ type: e.target.value as any })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            >
              {questionTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-harmony-dark">
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Points</label>
            <input
              type="number"
              min="1"
              value={question.points}
              onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 10 })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            />
          </div>
        </div>
      </div>

      {/* Answers */}
      {question.type !== 'essay' && question.type !== 'fill_in_blank' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-harmony-cream">Answer Options</label>
            <button
              onClick={onAddAnswer}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
            >
              <Plus className="h-3 w-3" />
              <span>Add Option</span>
            </button>
          </div>

          <div className="space-y-2">
            {question.answers.map((answer, answerIndex) => (
              <div key={answerIndex} className="flex items-center space-x-3 bg-white/5 p-3 rounded border border-harmony-cream/20">
                <input
                  type={question.type === 'multiple_choice' ? 'checkbox' : 'radio'}
                  name={`question-${question.id}`}
                  checked={answer.isCorrect}
                  onChange={(e) => {
                    if (question.type === 'single_choice' || question.type === 'true_false') {
                      // Single choice - uncheck others
                      const newAnswers = question.answers.map((a, i) => ({
                        ...a,
                        isCorrect: i === answerIndex ? e.target.checked : false
                      }))
                      onUpdate({ answers: newAnswers })
                    } else {
                      // Multiple choice
                      onUpdateAnswer(answerIndex, { isCorrect: e.target.checked })
                    }
                  }}
                  className="text-blue-600"
                />
                
                <div className="flex-1">
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) => onUpdateAnswer(answerIndex, { text: e.target.value })}
                    className="w-full px-2 py-1 bg-white/10 border border-harmony-cream/20 rounded text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
                    placeholder={`Option ${String.fromCharCode(65 + answerIndex)}`}
                  />
                </div>

                {question.answers.length > 2 && (
                  <button
                    onClick={() => onDeleteAnswer(answerIndex)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-harmony-cream mb-1">Explanation (Optional)</label>
        <textarea
          value={question.explanation}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
          placeholder="Explain the correct answer..."
        />
      </div>
    </div>
  )
}
