import React, { useState, useRef, useEffect } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ChatbotSection from './components/ChatbotSection'
import HospitalsSection from './components/HospitalsSection'
import FeaturesSection from './components/FeaturesSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div>
      <Header />
      <HeroSection />
      <ChatbotSection />
      <HospitalsSection />
      <FeaturesSection />
      <Footer />
    </div>
  )
}
