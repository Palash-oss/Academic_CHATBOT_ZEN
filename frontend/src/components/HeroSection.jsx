import React from 'react'

const translations = {
  en: {
    hero_title: 'AI-Powered Healthcare Assistant',
    hero_desc: 'Accessible healthcare information in your local language. Get instant guidance on symptoms, prevention, and vaccination schedules.',
  },
  hi: {
    hero_title: 'एआई-संचालित स्वास्थ्य सहायक',
    hero_desc: 'अपनी स्थानीय भाषा में स्वास्थ्य जानकारी प्राप्त करें। लक्षण, रोकथाम और टीकाकरण पर त्वरित मार्गदर्शन।',
  },
  or: {
    hero_title: 'ଏଆଇ ଆଧାରିତ ହେଲ୍ଥ ସହାୟକ',
    hero_desc: 'ଆପଣଙ୍କ ଭାଷାରେ ସ୍ୱାସ୍ଥ୍ୟ ସୂଚନା। ଲକ୍ଷଣ, ପ୍ରତିରୋଧ ଏବଂ ଟୀକାକରଣରେ ତତ୍କ୍ଷଣାତ୍ ମଦଦ।',
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
        </div>
      </div>
    </section>
  )
}
