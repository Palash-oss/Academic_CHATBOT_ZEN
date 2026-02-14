import React, { useState, useRef, useEffect } from 'react'

const translations = {
  en: {
    learn_title: 'Learn with Vidya 🌟',
    welcome_msg: "Hi there! 👋 I'm Vidya, your friendly CBSE learning buddy! Ask me anything about Maths, English, Hindi, or EVS for your grade. Let's learn together! 🎓✨",
    grade_label: 'Your Grade:',
    subject_label: 'Subject:',
    chat_placeholder: 'Ask me anything about your studies...',
    btn_send: 'Send',
    loading_text: 'Thinking...',
    error_msg: "Sorry, I couldn't connect. Please try again!",
    points_earned: '⭐ You earned',
    stars: 'stars!',
  },
  hi: {
    learn_title: 'विद्या 🌟 के साथ सीखो',
    welcome_msg: 'नमस्ते! 👋 मैं विद्या, तुम्हारी दोस्ताना शिक्षा सहायक हूँ! मुझसे गणित, अंग्रेजी, हिंदी या ईवीएस के बारे में कुछ भी पूछो। चलो साथ सीखते हैं! 🎓✨',
    grade_label: 'तुम्हारी कक्षा:',
    subject_label: 'विषय:',
    chat_placeholder: 'अपनी पढ़ाई के बारे में कुछ भी पूछो...',
    btn_send: 'भेजो',
    loading_text: 'सोच रहा हूँ...',
    error_msg: 'माफी चाहता हूँ, कनेक्शन नहीं हो सका। फिर से कोशिश करो!',
    points_earned: '⭐ तुम्हें मिले',
    stars: 'सितारे!',
  }
}

export default function ChatbotSection() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: translations.en.welcome_msg }
  ])
  const [input, setInput] = useState('')
  const [language, setLanguage] = useState('en')
  const [grade, setGrade] = useState(2)
  const [subject, setSubject] = useState('Mathematics')
  const [loading, setLoading] = useState(false)
  const [activeProvider, setActiveProvider] = useState('grok')
  const [points, setPoints] = useState(0)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch active provider status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/status')
        const data = await response.json()
        setActiveProvider(data.active_provider || 'grok')
      } catch (error) {
        console.log('Could not fetch provider status')
      }
    }
    
    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const sendMessage = async (e) => {
    e?.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMsg = input
    setMessages(prev => [...prev, { type: 'user', text: userMsg }])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg,
          grade: parseInt(grade),
          subject: subject,
          language: language
        })
      })

      const data = await response.json()
      if (response.ok) {
        setActiveProvider(data.provider || 'grok')
        setMessages(prev => [...prev, { type: 'bot', text: data.response }])
        // Award points for each correct interaction
        setPoints(prev => prev + 10)
      } else {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: `😢 ${translations[language].error_msg}` 
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: `😢 ${translations[language].error_msg}` 
      }])
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const subjects = ['Mathematics', 'English', 'Hindi', 'EVS', 'All']

  return (
    <section id="learn" className="chatbot-section">
      <div className="container">
        <h2 className="section-title">{translations[language].learn_title}</h2>

        <div className="chat-controls">
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

          {/* AI Provider Badge */}
          <div className="provider-badge">
            <span className={`badge ${activeProvider}`}>
              {activeProvider === 'grok' ? '🤖 Grok' : '✨ Gemini'}
            </span>
          </div>

          {/* Points Display */}
          {points > 0 && (
            <div className="points-display">
              ⭐ {points} {translations[language].stars}
            </div>
          )}
        </div>

        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}-message`}>
                <div className="message-content">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="message bot-message">
                <div className="message-content">
                  <span className="loading"></span>
                  <span className="loading"></span>
                  <span className="loading"></span>
                  {translations[language].loading_text}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-container" onSubmit={sendMessage}>
            <input
              type="text"
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={translations[language].chat_placeholder}
              disabled={loading}
            />
            <button
              type="submit"
              className="send-button"
              disabled={loading}
            >
              {translations[language].btn_send}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
