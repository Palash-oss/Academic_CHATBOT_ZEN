import React, { useState, useRef, useEffect } from 'react'

const translations = {
  en: {
    test_bot_title: 'Test the Chatbot',
    welcome_msg: "Hello! I'm your healthcare assistant. I can help you with symptoms, prevention tips, and vaccination schedules. What would you like to know?",
    chat_placeholder: 'Type your health question...',
    btn_send: 'Send',
  },
  hi: {
    test_bot_title: 'चैटबॉट आज़माएँ',
    welcome_msg: 'नमस्ते! मैं आपका स्वास्थ्य सहायक हूँ। मैं लक्षण, रोकथाम टिप्स और टीकाकरण शेड्यूल में आपकी मदद कर सकता हूँ। आप क्या जानना चाहते हैं?',
    chat_placeholder: 'अपना स्वास्थ्य प्रश्न लिखें...',
    btn_send: 'भेजें',
  },
  or: {
    test_bot_title: 'ଚାଟବଟ୍ ପରୀକ୍ଷାନ୍ତୁ',
    welcome_msg: 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ହେଲ୍ଥ ସହାୟକ। ଲକ୍ଷଣ, ପ୍ରତିରୋଧ ଟିପ୍ସ ଏବଂ ଟୀକାକରଣ ସମ୍ବନ୍ଧୀୟ ସହଯୋଗ କରିପାରିବି। କଣ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି?',
    chat_placeholder: 'ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ...',
    btn_send: 'ପଠାନ୍ତୁ',
  }
}

export default function ChatbotSection() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: translations.en.welcome_msg }
  ])
  const [input, setInput] = useState('')
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e) => {
    e?.preventDefault()
    if (!input.trim()) return

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: input }])
    setInput('')
    setLoading(true)

    try {
      // Get geolocation
      let lat = null, lng = null
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          })
          lat = position.coords.latitude
          lng = position.coords.longitude
        } catch (e) {
          console.log('Geolocation not available')
        }
      }

      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          language: language,
          lat: lat,
          lng: lng
        })
      })

      const data = await response.json()
      if (response.ok) {
        setMessages(prev => [...prev, { type: 'bot', text: data.response }])
      } else {
        setMessages(prev => [...prev, { type: 'bot', text: `Error: ${data.error || 'Failed to get response'}` }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: "Sorry, I couldn't connect to the server. Please try again." }])
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="test-bot" className="chatbot-section">
      <div className="container">
        <h2 className="section-title">{translations[language].test_bot_title}</h2>

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
                  Thinking...
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
