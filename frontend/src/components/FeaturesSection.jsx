import React, { useState } from 'react'

const translations = {
  en: {
    features_title: 'Features',
    feat_multi_title: 'Multi-Language Support',
    feat_multi_desc: 'Get healthcare information in your preferred language',
    feat_symptom_title: 'Symptom Analysis',
    feat_symptom_desc: 'Quick assessment of your symptoms with AI-powered insights',
    feat_prev_title: 'Prevention Tips',
    feat_prev_desc: 'Stay healthy with personalized prevention recommendations',
    feat_vax_title: 'Vaccination Schedule',
    feat_vax_desc: 'Keep track of important vaccinations and immunizations',
    feat_hosp_title: 'Hospital Locator',
    feat_hosp_desc: 'Find nearby hospitals and healthcare facilities instantly',
    feat_247_title: '24/7 Availability',
    feat_247_desc: 'Get healthcare guidance anytime, anywhere',
  },
  hi: {
    features_title: 'विशेषताएँ',
    feat_multi_title: 'बहुभाषी समर्थन',
    feat_multi_desc: 'अपनी पसंदीदा भाषा में स्वास्थ्य जानकारी प्राप्त करें',
    feat_symptom_title: 'लक्षण विश्लेषण',
    feat_symptom_desc: 'एआई-समर्थित अंतर्दृष्टि के साथ तेज़ आकलन',
    feat_prev_title: 'रोकथाम सुझाव',
    feat_prev_desc: 'व्यक्तिगत सिफारिशों के साथ स्वस्थ रहें',
    feat_vax_title: 'टीकाकरण कार्यक्रम',
    feat_vax_desc: 'महत्वपूर्ण टीकाकरण का ध्यान रखें',
    feat_hosp_title: 'अस्पताल लोकेटर',
    feat_hosp_desc: 'नज़दीकी अस्पताल और सुविधाएँ तुरंत खोजें',
    feat_247_title: '24/7 उपलब्ध',
    feat_247_desc: 'कभी भी, कहीं भी स्वास्थ्य मार्गदर्शन',
  },
  or: {
    features_title: 'ବିଶେଷତା',
    feat_multi_title: 'ବହୁଭାଷୀ ସମର୍ଥନ',
    feat_multi_desc: 'ଆପଣଙ୍କ ପସନ୍ଦର ଭାଷାରେ ସ୍ୱାସ୍ଥ୍ୟ ସୂଚନା',
    feat_symptom_title: 'ଲକ୍ଷଣ ବିଶ୍ଳେଷଣ',
    feat_symptom_desc: 'ଏଆଇ ଆଧାରିତ ତଥ୍ୟ ସହ ତ୍ୱରିତ ମୂଲ୍ୟାୟନ',
    feat_prev_title: 'ପ୍ରତିରୋଧ ସୁପାରିଶ',
    feat_prev_desc: 'ବ୍ୟକ୍ତିଗତ ପରାମର୍ଶ ସହିତ ସ୍ୱାସ୍ଥ୍ୟ ରୁହନ୍ତୁ',
    feat_vax_title: 'ଟୀକାକରଣ ସୂଚୀ',
    feat_vax_desc: 'ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଟୀକାକରଣ ଠାରୁ ଅବଗତ ରୁହନ୍ତୁ',
    feat_hosp_title: 'ହସ୍ପିଟାଲ୍ ଲୋକେଟର୍',
    feat_hosp_desc: 'ନିକଟସ୍ଥ ହସ୍ପିଟାଲ୍ ଏବଂ ସୁବିଧା ତୁରନ୍ତ ଖୋଜନ୍ତୁ',
    feat_247_title: '24/7 ଉପଲବ୍ଧ',
    feat_247_desc: 'କେବେ, କୋଥାଉ ମଧ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା',
  }
}

const features = [
  { icon: 'fas fa-language', key: 'multi' },
  { icon: 'fas fa-stethoscope', key: 'symptom' },
  { icon: 'fas fa-shield-virus', key: 'prev' },
  { icon: 'fas fa-syringe', key: 'vax' },
  { icon: 'fas fa-hospital', key: 'hosp' },
  { icon: 'fas fa-clock', key: '247' },
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
              <div className="feature-icon">
                <i className={f.icon}></i>
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
