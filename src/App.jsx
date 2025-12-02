import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'chat'

  return (
    <div className="app">
      {currentView === 'landing' ? (
        <LandingPage onEnterApp={() => setCurrentView('chat')} />
      ) : (
        <ChatInterface onBack={() => setCurrentView('landing')} />
      )}
    </div>
  );
}

export default App;
