// App.jsx - UPDATED WITH PROFESSIONAL CSS CLASSES
import React, { useEffect, useState } from 'react';
import FloatingChatBubble from './components/FloatingChatBubble';
import axios from 'axios';
import './App.css'; // Make sure to import the CSS file

function App() {
  const [backendMessage, setBackendMessage] = useState('Connexion au serveur...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('https://ai-chatbot-backend-ouvg.onrender.com/api/health')
      .then(res => {
        setBackendMessage('✅ Serveur connecté et prêt');
        setIsLoading(false);
      })
      .catch(err => {
        setBackendMessage('❌ Erreur de connexion au serveur');
        setIsLoading(false);
      });
  }, []);

  const services = [
    {
      icon: '🩺',
      title: 'Diagnostic Intelligent',
      description: 'Analyse avancée de vos symptômes avec IA médicale'
    },
    {
      icon: '💊',
      title: 'Guide Médicamenteux',
      description: 'Informations complètes sur les médicaments et interactions'
    },
    {
      icon: '📊',
      title: 'Suivi Santé',
      description: 'Surveillance continue de vos indicateurs de santé'
    },
    {
      icon: '👨‍⚕️',
      title: 'Conseils Experts',
      description: 'Recommandations personnalisées par domaines médicaux'
    },
    {
      icon: '🔄',
      title: 'Services 24/7',
      description: 'Assistance médicale continue à tout moment'
    },
    {
      icon: '🔒',
      title: 'Confidentialité',
      description: 'Vos données médicales sécurisées et privées'
    }
  ];

  return (
    <div className="connectcare-app">
      {/* Animated background */}
      <div className="animated-background" />

      {/* Header Section */}
      <header className="hero-section">
        <div className="hero-logo">
          ⚕️
        </div>
        
        <h1 className="hero-title">
          ConnectCare
        </h1>
        
        <p className="hero-subtitle">
          Soins de santé nouvelle génération, intelligents et accessibles
        </p>

        {/* Status Indicator */}
        <div className="status-indicator">
          <div className={`status-dot ${isLoading ? 'loading' : backendMessage.includes('Erreur') ? 'error' : ''}`} />
          <span>{backendMessage}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Services Grid */}
        <section className="services-section">
          <h2 className="section-title">
            Nos Services Innovants
          </h2>

          <div className="services-grid">
            {services.map((service, index) => (
              <div
                key={index}
                className="service-card"
              >
                <div className="service-icon">
                  {service.icon}
                </div>
                
                <h3 className="service-title">
                  {service.title}
                </h3>
                
                <p className="service-description">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Section */}
        <section className="emergency-section">
          <div className="emergency-banner">
            <div className="emergency-pulse" />
            
            <h3 className="emergency-title">
              <span className="emergency-alert">
                🚨
              </span>
              Urgences Médicales
            </h3>
            
            <p className="emergency-text">
              En cas d'urgence vitale, contactez immédiatement les services d'urgence
            </p>
            
            <div className="emergency-numbers">
              <div className="emergency-number">
                📞 190
              </div>
              
              <div className="emergency-number">
                🏥 150
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant Info */}
        <section className="ai-assistant-section">
          <div className="ai-banner">
            <h3 className="ai-title">
              <span className="ai-robot">
                🤖
              </span>
              Assistant Médical IA
            </h3>
            
            <p className="ai-description">
              Notre assistant IA avancé vous offre des conseils médicaux instantanés, 
              une analyse intelligente de symptômes et un support personnalisé 24h/24
            </p>

            <div className="features-grid">
              {[
                { icon: '⚡', text: 'Réponses instantanées' },
                { icon: '🎯', text: 'Précision médicale' },
                { icon: '🛡️', text: 'Données sécurisées' },
                { icon: '🌐', text: 'Support multilingue' }
              ].map((feature, index) => (
                <div key={index} className="feature-card">
                  <span className="feature-icon">{feature.icon}</span>
                  <span className="feature-text">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Chat Bubble */}
      <FloatingChatBubble />
    </div>
  );
}

export default App;
