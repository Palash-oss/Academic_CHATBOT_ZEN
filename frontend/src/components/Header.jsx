import React, { useState } from 'react'

const translations = {
  en: {
    app_name: 'Vidya 🌟',
    nav_home: 'Home',
    nav_learn: 'Learn',
    nav_quiz: 'Quiz',
    nav_about: 'About',
  },
  hi: {
    app_name: 'विद्या 🌟',
    nav_home: 'होम',
    nav_learn: 'सीखो',
    nav_quiz: 'क्विज',
    nav_about: 'बारे में',
  }
}

export default function Header() {
  const [language, setLanguage] = useState('en')

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <h2>{translations[language].app_name}</h2>
          </div>
          <ul className="nav-menu">
            <li><a href="#hero" className="nav-link" onClick={() => scrollToSection('hero')}>{translations[language].nav_home}</a></li>
            <li><a href="#chat" className="nav-link" onClick={() => scrollToSection('chat')}>{translations[language].nav_learn}</a></li>
            <li><a href="#quiz" className="nav-link" onClick={() => scrollToSection('quiz')}>{translations[language].nav_quiz}</a></li>
            <li><a href="#features" className="nav-link" onClick={() => scrollToSection('features')}>{translations[language].nav_about}</a></li>
          </ul>
          <div className="language-selector">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">🇬🇧 EN</option>
              <option value="hi">🇮🇳 HI</option>
            </select>
          </div>
        </div>
      </nav>
    </header>
  )
}
