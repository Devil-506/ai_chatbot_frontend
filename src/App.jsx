// App.jsx - COMPLETELY REFACTORED FOR GREATNESS!
import React, { useEffect, useState } from 'react';
import FloatingChatBubble from './components/FloatingChatBubble';
import axios from 'axios';
import './App.css';

const ConnectCareApp = () => {
  const [appState, setAppState] = useState({
    backendStatus: 'connecting',
    message: 'Connexion au serveur...'
  });

  const services = [
    { icon: '🩺', title: 'Diagnostic Intelligent', description: 'Analyse avancée de vos symptômes avec IA médicale' },
    { icon: '💊', title: 'Guide Médicamenteux', description: 'Informations complètes sur les médicaments et interactions' },
    { icon: '📊', title: 'Suivi Santé', description: 'Surveillance continue de vos indicateurs de santé' },
    { icon: '👨‍⚕️', title: 'Conseils Experts', description: 'Recommandations personnalisées par domaines médicaux' },
    { icon: '🔄', title: 'Services 24/7', description: 'Assistance médicale continue à tout moment' },
    { icon: '🔒', title: 'Confidentialité', description: 'Vos données médicales sécurisées et privées' }
  ];

  const aiFeatures = [
    { icon: '⚡', text: 'Réponses instantanées' },
    { icon: '🎯', text: 'Précision médicale' },
    { icon: '🛡️', text: 'Données sécurisées' },
    { icon: '🌐', text: 'Support multilingue' }
  ];

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await axios.get('https://ai-chatbot-backend-ouvg.onrender.com/api/health');
        setAppState({ backendStatus: 'connected', message: '✅ Serveur connecté et prêt' });
      } catch (error) {
        setAppState({ backendStatus: 'error', message: '❌ Erreur de connexion au serveur' });
      }
    };

    initializeApp();
  }, []);

  const StatusIndicator = () => (
    <div className="status-indicator">
      <div className={`status-dot ${appState.backendStatus}`} />
      <span>{appState.message}</span>
    </div>
  );

  const ServiceGrid = () => (
    <div className="services-grid">
      {services.map((service, index) => (
        <div key={service.title} className="service-card" tabIndex={0}>
          <div className="service-icon" aria-hidden="true">
            {service.icon}
          </div>
          <h3 className="service-title">{service.title}</h3>
          <p className="service-description">{service.description}</p>
        </div>
      ))}
    </div>
  );

  const EmergencySection = () => (
    <div className="emergency-banner" role="alert" aria-live="assertive">
      <div className="emergency-pulse" aria-hidden="true" />
      <h3 className="emergency-title">
        <span className="emergency-alert" aria-label="Alerte urgence">🚨</span>
        Urgences Médicales
      </h3>
      <p className="emergency-text">
        En cas d'urgence vitale, contactez immédiatement les services d'urgence
      </p>
      <div className="emergency-numbers">
        <div className="emergency-number" aria-label="Numéro d'urgence 190">
          📞 190
        </div>
        <div className="emergency-number" aria-label="Numéro d'urgence 150">
          🏥 150
        </div>
      </div>
    </div>
  );

  const AIAssistantSection = () => (
    <div className="ai-banner">
      <h3 className="ai-title">
        <span className="ai-robot" aria-label="Assistant IA">🤖</span>
        Assistant Médical IA
      </h3>
      <p className="ai-description">
        Notre assistant IA avancé vous offre des conseils médicaux instantanés, 
        une analyse intelligente de symptômes et un support personnalisé 24h/24
      </p>
      <div className="features-grid">
        {aiFeatures.map((feature, index) => (
          <div key={feature.text} className="feature-card" tabIndex={0}>
            <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
            <span className="feature-text">{feature.text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="connectcare-app">
      <div className="animated-background" aria-hidden="true" />
      
      <header className="hero-section">
        <div className="hero-logo" aria-label="Logo ConnectCare">
          ⚕️
        </div>
        <h1 className="hero-title">ConnectCare</h1>
        <p className="hero-subtitle">
          Soins de santé nouvelle génération, intelligents et accessibles
        </p>
        <StatusIndicator />
      </header>

      <main className="main-content">
        <section className="services-section" aria-labelledby="services-title">
          <h2 id="services-title" className="section-title">Nos Services Innovants</h2>
          <ServiceGrid />
        </section>

        <section className="emergency-section" aria-labelledby="emergency-title">
          <h2 id="emergency-title" className="sr-only">Urgences Médicales</h2>
          <EmergencySection />
        </section>

        <section className="ai-assistant-section" aria-labelledby="ai-assistant-title">
          <h2 id="ai-assistant-title" className="sr-only">Assistant Médical IA</h2>
          <AIAssistantSection />
        </section>
      </main>

      <FloatingChatBubble />
    </div>
  );
};

export default ConnectCareApp;
