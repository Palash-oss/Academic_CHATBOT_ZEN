import React, { useState } from 'react'

const translations = {
  en: {
    footer_title: 'Vidya 🌟',
    footer_tagline: 'Your CBSE Learning Buddy for Grades 1-4',
    footer_copy: '© 2024 Vidya 🌟. Aligned with CBSE Curriculum. All rights reserved.',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_contact: 'Contact',
  },
  hi: {
    footer_title: 'विद्या 🌟',
    footer_tagline: 'ग्रेड 1-4 के लिए तुम्हारा CBSE सीखने का साथी',
    footer_copy: '© 2024 विद्या 🌟. CBSE पाठ्यक्रम के अनुरूप। सर्वाधिकार सुरक्षित।',
    footer_privacy: 'गोपनीयता नीति',
    footer_terms: 'सेवा की शर्तें',
    footer_contact: 'संपर्क',
  }
}

export default function Footer() {
  const [language] = useState('en')

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-branding">
            <h3>{translations[language].footer_title}</h3>
            <p>{translations[language].footer_tagline}</p>
          </div>
          <p className="footer-copy">{translations[language].footer_copy}</p>
          <div className="footer-links">
            <a href="#">{translations[language].footer_privacy}</a>
            <a href="#">{translations[language].footer_terms}</a>
            <a href="#">{translations[language].footer_contact}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
