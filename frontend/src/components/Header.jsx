import React, { useState, useEffect } from 'react'

const translations = {
  en: {
    app_name: 'Healthcare AI Bot',
    nav_features: 'Features',
    nav_test_bot: 'Test Bot',
    nav_alerts: 'Alerts',
    nav_hospitals: 'Nearby Hospitals',
  },
  hi: {
    app_name: 'हेल्थकेयर एआई बॉट',
    nav_features: 'विशेषताएँ',
    nav_test_bot: 'बॉट आज़माएँ',
    nav_alerts: 'चेतावनियाँ',
    nav_hospitals: 'नज़दीकी अस्पताल',
  },
  or: {
    app_name: 'ହେଲ୍ଥକେୟାର୍ ଏଆଇ ବଟ୍',
    nav_features: 'ବିଶେଷତା',
    nav_test_bot: 'ବଟ୍ ପରୀକ୍ଷାନ୍ତୁ',
    nav_alerts: 'ସତର୍କତା',
    nav_hospitals: 'ନିକଟସ୍ଥ ହସ୍ପିଟାଲ୍',
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
            <li><a href="#features" className="nav-link" onClick={() => scrollToSection('features')}>{translations[language].nav_features}</a></li>
            <li><a href="#test-bot" className="nav-link" onClick={() => scrollToSection('test-bot')}>{translations[language].nav_test_bot}</a></li>
            <li><a href="#alerts" className="nav-link" onClick={() => scrollToSection('alerts')}>{translations[language].nav_alerts}</a></li>
            <li><a href="#nearby-hospitals" className="nav-link" onClick={() => scrollToSection('nearby-hospitals')}>{translations[language].nav_hospitals}</a></li>
          </ul>
          <div className="language-selector">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="or">OR</option>
            </select>
          </div>
        </div>
      </nav>
    </header>
  )
}
