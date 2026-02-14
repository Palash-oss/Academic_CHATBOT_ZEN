# Healthcare AI Bot - React + Flask App

A modern, responsive healthcare AI chatbot built with React (frontend) and Flask (backend), featuring symptom analysis, prevention tips, vaccination schedules, and nearby hospital locator.

## Tech Stack

- **Frontend**: React 18 + Vite (port 3000)
- **Backend**: Flask + Python (port 8080)
- **AI/ML**: LangChain, HuggingFace Embeddings, Pinecone, HuggingFace Transformers
- **Maps**: Leaflet.js with OpenStreetMap
- **Database**: Pinecone Vector DB

## Prerequisites

- Python 3.10 or higher
- Node.js 16+ and npm/yarn
- Pinecone API key
- PDF files for medical knowledge base

## Installation & Setup

### Backend Setup

#### Step 1: Create Python Virtual Environment

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

#### Step 2: Install Backend Dependencies

```bash
pip install -r requirements.txt
```

#### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory (same level as `backend/` and `frontend/`):

```env
PINECONE_API_KEY=your_pinecone_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
WHATSAPP_VERIFY_TOKEN=your_whatsapp_verify_token
WHATSAPP_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_ID=your_whatsapp_phone_id
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=your_twilio_whatsapp_from
```

#### Step 4: Prepare Medical Data

Place your medical PDF files in the `data/` directory (at repo root):

```
/data
  ├── medical_book.pdf
  ├── symptoms_guide.pdf
  └── vaccination_schedule.pdf
```

#### Step 5: Build the Vector Index

From the repo root, run:

```bash
python backend/store_index.py
```

This will:
- Load PDFs from the `data/` folder
- Split them into chunks
- Generate embeddings using HuggingFace
- Store them in Pinecone vector database

### Frontend Setup

#### Step 1: Install Frontend Dependencies

```bash
cd frontend
npm install
# or yarn install
```

#### Step 2: Run Frontend Dev Server

```bash
npm run dev
# or yarn dev
```

Frontend will start on `http://localhost:3000`

## Running the Application

### Terminal 1: Start Backend (port 8080)

```bash
cd backend
python app.py
```

Backend API will be available at `http://localhost:8080`

### Terminal 2: Start Frontend (port 3000)

```bash
cd frontend
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Build for Production

#### Frontend Build

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

## Using the Application

Once both backend and frontend are running:

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Test the Chatbot**:
   - Type your health-related questions in the chat input
   - Press Enter or click Send
   - Get AI-powered responses from your medical knowledge base

3. **Find Nearby Hospitals**:
   - Click "Get My Location" button
   - Allow location access in your browser
   - View hospitals on the interactive Leaflet map
   - Click hospital cards to open in Google Maps

4. **Explore Features**:
   - Use language selector (EN/HI/OR) to switch languages
   - Navigate using smooth scroll to different sections
   - View symptom analysis, prevention tips, vaccination schedules

## Project Structure

```
.
├── backend/                   # Flask backend API
│   ├── app.py                 # Main Flask application
│   ├── store_index.py         # Script to build Pinecone index
│   ├── requirements.txt       # Python dependencies
│   └── src/
│       ├── helper.py          # PDF processing & embeddings
│       └── prompt.py          # System prompts
│
├── frontend/                  # React frontend
│   ├── package.json           # npm dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── index.html            # React entry point
│   └── src/
│       ├── main.jsx          # React root
│       ├── App.jsx           # Main App component
│       ├── index.css         # Global styles
│       ├── styles/
│       │   └── modern_style.css
│       └── components/
│           ├── Header.jsx
│           ├── HeroSection.jsx
│           ├── ChatbotSection.jsx
│           ├── HospitalsSection.jsx
│           ├── FeaturesSection.jsx
│           └── Footer.jsx
│
├── data/                      # Medical PDF files (add your PDFs here)
├── .env                       # Environment variables (create this)
├── .gitignore                 # Git ignore configuration
└── README_NEW.md              # This file
```

## API Endpoints

### Chat Endpoint
- **POST** `/api/chat`
- Request: `{ "message": "user question", "language": "en", "lat": null, "lng": null }`
- Response: `{ "response": "AI response", "sources": [...] }`

### Nearby Hospitals Endpoint
- **POST** `/api/nearby-hospitals`
- Request: `{ "lat": 19.0760, "lng": 72.8777, "language": "en" }`
- Response: `{ "hospitals": [...] }`

## Troubleshooting

### Issue: "Port 3000 already in use"
**Solution**: Change the port in `frontend/vite.config.js`:
```javascript
server: {
  port: 3001,  // Change to another port
  strictPort: false
}
```

### Issue: "Port 8080 already in use"
**Solution**: Modify the last line of `backend/app.py`:
```python
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)  # Change port
```

### Issue: "CORS error" or "Failed to connect to backend"
**Solution**:
1. Ensure backend is running on port 8080: `python backend/app.py`
2. Check `frontend/src/components/ChatbotSection.jsx` and `HospitalsSection.jsx` have correct backend URL
3. Backend has CORS enabled in `backend/app.py`

### Issue: "No module named 'xxx'"
**Solution**: Install missing dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Issue: "Chat not responding"
**Debugging steps**:
1. Check backend console for errors: `python backend/app.py`
2. Verify Pinecone index was created: check `backend/store_index.py` output
3. Ensure `.env` has `PINECONE_API_KEY`
4. Check browser network tab for API response

## Development Notes

- **Frontend uses Vite** for fast HMR and builds
- **Same CSS styling** preserved from original HTML version
- **Multi-language support** with EN, HI, OR
- **CORS enabled** on backend for cross-origin requests
- **Leaflet.js** for maps (no external API key needed)
- **React hooks** for state management (useState, useRef, useEffect)

## Production Deployment

### Build Frontend

```bash
cd frontend
npm run build
# Creates optimized build in frontend/dist/
```

### Production Deployment

1. **Build React frontend**:
```bash
cd frontend && npm run build
```

2. **Deploy to cloud provider** (Heroku, AWS Lambda, Google Cloud, etc.)

**Option A: Separate Hosting**
- Frontend: Deploy `frontend/dist` to Vercel/Netlify  
- Backend: Deploy `backend/` to cloud hosting

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue on the GitHub repository.