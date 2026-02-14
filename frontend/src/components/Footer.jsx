import React, { useState } from 'react'

const translations = {
  en: {
    footer_copy: '© 2024 Healthcare AI Bot. All rights reserved.',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_contact: 'Contact',
  },
  hi: {
    footer_copy: '© 2024 हेल्थकेयर एआई बॉट. सर्वाधिकार सुरक्षित.',
    footer_privacy: 'गोपनीयता नीति',
    footer_terms: 'सेवा की शर्तें',
    footer_contact: 'संपर्क',
  },
  or: {
    footer_copy: '© 2024 ହେଲ୍ଥକେୟାର୍ ଏଆଇ ବଟ୍. ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ।',
    footer_privacy: 'ଗୋପନୀୟତା ନୀତି',
    footer_terms: 'ସେବା ସର୍ତ୍ତ',
    footer_contact: 'ସପର୍କ',
  }
}

export default function Footer() {
  const [language] = useState('en')

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>{translations[language].footer_copy}</p>
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
