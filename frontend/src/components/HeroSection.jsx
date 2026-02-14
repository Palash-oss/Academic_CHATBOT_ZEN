import React from 'react'

const translations = {
  en: {
    hero_title: 'Vidya 🌟 — Your CBSE Learning Buddy',
    hero_desc: 'Fun, smart learning for Grade 1-4 students 📚 Learn Math, English, Hindi & Science with gamified quizzes, doubt solving, and Indian examples!',
    subjects_heading: 'Learn These Subjects:',
    maths: '🔢 Mathematics',
    english: '📖 English',
    hindi: '🌿 Hindi',
    evs: '🌍 Science & EVS',
  },
  hi: {
    hero_title: 'विद्या 🌟 — तुम्हारा सीखने का साथी',
    hero_desc: 'ग्रेड 1-4 के छात्रों के लिए मजेदार, स्मार्ट सीखना 📚 गेम्स, क्विज, और भारतीय उदाहरणों के साथ सीखो!',
    subjects_heading: 'ये विषय सीखो:',
    maths: '🔢 गणित',
    english: '📖 अंग्रेजी',
    hindi: '🌿 हिंदी',
    evs: '🌍 विज्ञान & पर्यावरण',
  }
}

export default function HeroSection() {
  const [language] = React.useState('en')

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">{translations[language].hero_title}</h1>
          <p className="hero-description">{translations[language].hero_desc}</p>
          
          <div className="subjects-grid">
            <h3 className="subjects-heading">{translations[language].subjects_heading}</h3>
            <div className="subjects-list">
              <div className="subject-card">
                <span className="subject-emoji">🔢</span>
                <p>{translations[language].maths}</p>
              </div>
              <div className="subject-card">
                <span className="subject-emoji">📖</span>
                <p>{translations[language].english}</p>
              </div>
              <div className="subject-card">
                <span className="subject-emoji">🌿</span>
                <p>{translations[language].hindi}</p>
              </div>
              <div className="subject-card">
                <span className="subject-emoji">🌍</span>
                <p>{translations[language].evs}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
