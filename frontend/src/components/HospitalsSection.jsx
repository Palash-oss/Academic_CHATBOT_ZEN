import React, { useRef, useEffect, useState } from 'react'

const translations = {
  en: { nearby_hospitals_title: 'Nearby Hospitals', btn_location: 'Get My Location' },
  hi: { nearby_hospitals_title: 'नज़दीकी अस्पताल', btn_location: 'मेरी लोकेशन प्राप्त करें' },
  or: { nearby_hospitals_title: 'ନିକଟସ୍ଥ ହସ୍ପିଟାଲ୍', btn_location: 'ମୋ ଲୋକେସନ୍ ନିଅନ୍ତୁ' }
}

declare global {
  var L: any
}

export default function HospitalsSection() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [hospitals, setHospitals] = useState([])
  const [language] = useState('en')
  const markersRef = useRef([])

  useEffect(() => {
    // Load Leaflet
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = initializeMap
    document.body.appendChild(script)
  }, [])

  const initializeMap = () => {
    if (mapInstanceRef.current) return
    
    const L = window.L
    mapInstanceRef.current = L.map('map').setView([19.0760, 72.8777], 13)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstanceRef.current)
  }

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        findNearbyHospitals(latitude, longitude)
      },
      error => {
        console.error('Geolocation error:', error)
        findNearbyHospitals(19.0760, 72.8777)
      }
    )
  }

  const findNearbyHospitals = async (lat, lng) => {
    try {
      const L = window.L
      const map = mapInstanceRef.current

      if (!map) return

      // Clear existing markers
      markersRef.current.forEach(marker => map.removeLayer(marker))
      markersRef.current = []

      // Update map center
      map.setView([lat, lng], 14)

      // Add user marker
      const userMarker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(map)
      userMarker.bindPopup('Your Location').openPopup()
      markersRef.current.push(userMarker)

      // Fetch hospitals
      const response = await fetch('http://localhost:8080/api/nearby-hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, language })
      })

      const data = await response.json()
      const hospitalsList = data.hospitals || []

      setHospitals(hospitalsList)

      // Add hospital markers
      hospitalsList.slice(0, 10).forEach(hospital => {
        const marker = L.marker([hospital.lat, hospital.lng], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).addTo(map)
        marker.bindPopup(`<b>${hospital.name}</b>${hospital.distance_km ? '<br>' + hospital.distance_km + ' km' : ''}`)
        markersRef.current.push(marker)
      })
    } catch (error) {
      console.error('Error fetching hospitals:', error)
    }
  }

  return (
    <section id="nearby-hospitals" className="hospitals-section">
      <div className="container">
        <h2 className="section-title">{translations[language].nearby_hospitals_title}</h2>

        <div className="location-button-container">
          <button className="get-location-btn" onClick={getUserLocation}>
            <i className="fas fa-map-marker-alt"></i>
            <span>{translations[language].btn_location}</span>
          </button>
        </div>

        <div className="map-container">
          <div id="map" ref={mapRef}></div>
        </div>

        <div className="hospitals-grid">
          {hospitals.map((hospital, idx) => (
            <div key={idx} className="hospital-card">
              <div className="hospital-name">{idx + 1}. {hospital.name}</div>
              <div className="hospital-distance">{hospital.distance_km ? `${hospital.distance_km} km` : ''}</div>
              <a href={hospital.map_url} target="_blank" rel="noopener noreferrer" className="hospital-link">
                Open in Google Maps →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
