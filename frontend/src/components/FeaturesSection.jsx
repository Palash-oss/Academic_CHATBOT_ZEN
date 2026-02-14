import React, { useState } from 'react'

const translations = {
  en: {
    features_title: 'Why Choose Vidya? 🎓',
    feat_personalized_title: 'Personalized Learning',
    feat_personalized_desc: 'Content adapts intelligently to your grade level and learning speed',
    feat_gamified_title: 'Gamified Quizzes',
    feat_gamified_desc: 'Earn stars ⭐ and badges 🏆 while mastering each topic',
    feat_textbook_title: 'Textbook Aligned',
    feat_textbook_desc: 'Follows CBSE curriculum for Grades 1-4 with verified content',
    feat_indian_title: 'Indian Context',
    feat_indian_desc: 'Real examples from Indian daily life: food, festivals, games, culture',
    feat_doubt_title: 'Guided Doubt Solving',
    feat_doubt_desc: 'Never just answers! Guided hints help you discover solutions yourself',
    feat_progress_title: 'Progress Tracking',
    feat_progress_desc: 'Watch yourself level up with detailed performance insights',
  },
  hi: {
    features_title: 'विद्या को क्यों चुनो? 🎓',
    feat_personalized_title: 'व्यक्तिगत सीखना',
    feat_personalized_desc: 'सामग्री तुम्हारी कक्षा और गति के अनुसार बदलती है',
    feat_gamified_title: 'गेमिफाइड क्विज़',
    feat_gamified_desc: 'सितारे ⭐ और बैज 🏆 कमाओ सीखते समय',
    feat_textbook_title: 'पाठ्यपुस्तक से मेल',
    feat_textbook_desc: 'CBSE पाठ्यक्रम के साथ सभी ग्रेड 1-4 के लिए',
    feat_indian_title: 'भारतीय संदर्भ',
    feat_indian_desc: 'भारतीय जीवन से वास्तविक उदाहरण: खाना, त्योहार, खेल',
    feat_doubt_title: 'निर्देशित संदेह समाधान',
    feat_doubt_desc: 'कभी सीधे उत्तर नहीं! हिंट तुम्हें खुद खोजने में मदद करते हैं',
    feat_progress_title: 'प्रगति ट्रैकिंग',
    feat_progress_desc: 'तुम्हारी उपलब्धियों को देखो विस्तृत विश्लेषण के साथ',
  }
}

const features = [
  { emoji: '✨', key: 'personalized' },
  { emoji: '🎮', key: 'gamified' },
  { emoji: '📖', key: 'textbook' },
  { emoji: '🇮🇳', key: 'indian' },
  { emoji: '🤔', key: 'doubt' },
  { emoji: '🏆', key: 'progress' },
]

export default function FeaturesSection() {
  const [language] = useState('en')

  return (
    <section id="features" className="features-section">
      <div className="container">
        <h2 className="section-title">{translations[language].features_title}</h2>
        <div className="features-grid">
          {features.map((f, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-emoji">
                <span className="emoji-large">{f.emoji}</span>
              </div>
              <h3>{translations[language][`feat_${f.key}_title`]}</h3>
              <p>{translations[language][`feat_${f.key}_desc`]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
