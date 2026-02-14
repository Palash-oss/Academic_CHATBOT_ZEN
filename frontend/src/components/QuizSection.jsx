import React, { useState } from 'react'

const translations = {
  en: {
    quiz_title: 'Test Your Knowledge 🎓',
    grade_label: 'Select Grade:',
    subject_label: 'Select Subject:',
    topic_label: 'Topic (optional):',
    difficulty_label: 'Difficulty:',
    btn_generate: 'Generate Quiz ✨',
    question_label: 'Question:',
    your_answer: 'Your Answer:',
    btn_submit: 'Submit Answer',
    btn_next: 'Next Question',
    correct: '✅ Correct! Well done! 🌟',
    incorrect: "❌ Good try! Let's review...",
    points: 'Points Earned:',
    explanation: 'Explanation:',
    textbook_ref: 'Textbook Reference:',
    loading: 'Generating quiz...',
  },
  hi: {
    quiz_title: 'अपना ज्ञान परीक्षण करो 🎓',
    grade_label: 'कक्षा चुनो:',
    subject_label: 'विषय चुनो:',
    topic_label: 'विषय (वैकल्पिक):',
    difficulty_label: 'कठिनाई:',
    btn_generate: 'क्विज बनाओ ✨',
    question_label: 'प्रश्न:',
    your_answer: 'तुम्हारा उत्तर:',
    btn_submit: 'उत्तर भेजो',
    btn_next: 'अगला प्रश्न',
    correct: '✅ सही है! शाबाश! 🌟',
    incorrect: "❌ अच्छी कोशिश! आइए समीक्षा करें...",
    points: 'कमाए हुए अंक:',
    explanation: 'व्याख्या:',
    textbook_ref: 'पाठ्यपुस्तक संदर्भ:',
    loading: 'क्विज बना रहा है...',
  }
}

export default function QuizSection() {
  const [grade, setGrade] = useState(2)
  const [subject, setSubject] = useState('Mathematics')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [language, setLanguage] = useState('en')
  const [quiz, setQuiz] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)

  const subjects = ['Mathematics', 'English', 'Hindi', 'EVS']
  const difficulties = ['easy', 'medium', 'hard']

  const generateQuiz = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic!')
      return
    }

    setLoading(true)
    setSubmitted(false)
    setSelectedAnswer('')

    try {
      const response = await fetch('http://localhost:8080/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grade: parseInt(grade),
          subject: subject,
          topic: topic,
          difficulty: difficulty
        })
      })

      const data = await response.json()
      if (response.ok && data.quiz) {
        setQuiz(data.quiz)
      } else {
        alert('Failed to generate quiz. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = () => {
    if (!selectedAnswer.trim()) {
      alert('Please select an answer!')
      return
    }

    setSubmitted(true)
    
    // Check if answer is correct
    if (selectedAnswer.toUpperCase() === quiz.correct_answer) {
      setTotalPoints(prev => prev + (quiz.points || 10))
    }
  }

  const nextQuestion = () => {
    setQuiz(null)
    setSelectedAnswer('')
    setSubmitted(false)
    setTopic('')
  }

  return (
    <section id="quiz" className="quiz-section">
      <div className="container">
        <h2 className="section-title">{translations[language].quiz_title}</h2>

        {!quiz ? (
          <div className="quiz-generator">
            {/* Language Toggle */}
            <div className="control-group">
              <label>Language:</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
              </select>
            </div>

            {/* Grade Selector */}
            <div className="control-group">
              <label>{translations[language].grade_label}</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                <option value={1}>Grade 1</option>
                <option value={2}>Grade 2</option>
                <option value={3}>Grade 3</option>
                <option value={4}>Grade 4</option>
              </select>
            </div>

            {/* Subject Selector */}
            <div className="control-group">
              <label>{translations[language].subject_label}</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Topic Input */}
            <div className="control-group">
              <label>{translations[language].topic_label}</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Addition, Alphabets, Parts of Speech"
              />
            </div>

            {/* Difficulty Selector */}
            <div className="control-group">
              <label>{translations[language].difficulty_label}</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                {difficulties.map(d => (
                  <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <button 
              className="btn-generate" 
              onClick={generateQuiz}
              disabled={loading}
            >
              {loading ? translations[language].loading : translations[language].btn_generate}
            </button>

            {/* Points Display */}
            {totalPoints > 0 && (
              <div className="total-points">
                🏆 {translations[language].points} {totalPoints}
              </div>
            )}
          </div>
        ) : (
          <div className="quiz-display">
            {/* Question */}
            <div className="question-box">
              <h3>{translations[language].question_label}</h3>
              <p className="question-text">{quiz.question}</p>
            </div>

            {/* Options */}
            {!submitted && (
              <div className="options-container">
                <h4>{translations[language].your_answer}</h4>
                {Object.entries(quiz.options || {}).map(([key, value]) => (
                  <label key={key} className="option-label">
                    <input
                      type="radio"
                      name="option"
                      value={key}
                      checked={selectedAnswer === key}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                    />
                    <span className="option-text">
                      <strong>{key}.</strong> {value}
                    </span>
                  </label>
                ))}
                <button onClick={submitAnswer} className="btn-submit">
                  {translations[language].btn_submit}
                </button>
              </div>
            )}

            {/* Result */}
            {submitted && (
              <div className={`result ${selectedAnswer.toUpperCase() === quiz.correct_answer ? 'correct' : 'incorrect'}`}>
                <p className="result-text">
                  {selectedAnswer.toUpperCase() === quiz.correct_answer 
                    ? translations[language].correct 
                    : translations[language].incorrect}
                </p>

                <div className="explanation-box">
                  <h4>{translations[language].explanation}</h4>
                  <p>{quiz.explanation}</p>
                </div>

                {quiz.textbook_reference && (
                  <div className="textbook-ref">
                    <p>📖 {translations[language].textbook_ref}: {quiz.textbook_reference}</p>
                  </div>
                )}

                {quiz.points && selectedAnswer.toUpperCase() === quiz.correct_answer && (
                  <p className="points-earned">⭐ +{quiz.points} {translations[language].points}</p>
                )}

                <button onClick={nextQuestion} className="btn-next">
                  {translations[language].btn_next}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
