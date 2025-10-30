import React, { useEffect, useState } from 'react';
import FloatingChatBubble from './components/FloatingChatBubble';
import axios from 'axios';

function App() {
  const [backendMessage, setBackendMessage] = useState('Connexion au serveur...');

  useEffect(() => {
    // Fetch from Render backend
    axios.get('https://ai-chatbot-backend-ouvg.onrender.com/api/health')
      .then(res => setBackendMessage('✅ Serveur connecté et prêt'))
      .catch(err => setBackendMessage('❌ Erreur de connexion au serveur'));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Medical Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '40px' }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          backdropFilter: 'blur(10px)',
          border: '3px solid rgba(255,255,255,0.3)'
        }}>
          🏥
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px', fontWeight: 'bold' }}>ConnectCare</h1>
        <p style={{ fontSize: '1.3rem', opacity: 0.9 }}>Soins de santé intelligents à portée de main</p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '40px',
        borderRadius: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>Nos Services Médicaux Complets</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px',
          marginBottom: '50px'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
            padding: '30px',
            borderRadius: '15px',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👨‍⚕️</div>
            <h3 style={{ marginBottom: '15px', color: '#81D4FA' }}>Consultations Médicales Immédiates</h3>
            <p>Obtenez des réponses instantanées à vos questions médicales avec notre assistant intelligent</p>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
            padding: '30px',
            borderRadius: '15px',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💊</div>
            <h3 style={{ marginBottom: '15px', color: '#80CBC4' }}>Informations Pharmaceutiques</h3>
            <p>Renseignez-vous sur les médicaments, les dosages appropriés et les effets secondaires</p>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
            padding: '30px',
            borderRadius: '15px',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🩺</div>
            <h3 style={{ marginBottom: '15px', color: '#CE93D8' }}>Analyse des Symptômes</h3>
            <p>Décrivez vos symptômes et obtenez des conseils préliminaires de notre assistant médical</p>
          </div>
        </div>

        {/* Emergency Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #FF5252, #D32F2F)',
          padding: '25px',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '30px',
          boxShadow: '0 8px 25px rgba(211, 47, 47, 0.3)'
        }}>
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem' }}>🚨</span>
            Urgences et Premiers Secours
          </h3>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem' }}>
            En cas d'urgence, veuillez appeler immédiatement le numéro d'urgence
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '15px',
            borderRadius: '10px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            display: 'inline-block',
            margin: '0 10px'
          }}>
            📞 190
          </div>
        </div>

        {/* AI Assistant Info */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(56, 142, 60, 0.2))',
          padding: '25px',
          borderRadius: '15px',
          textAlign: 'center',
          border: '1px solid rgba(76, 175, 80, 0.3)'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem' }}>🤖</span>
            Assistant Médical Intelligent
          </h3>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem' }}>
            Cliquez sur l'icône de l'assistant dans le coin pour ouvrir la conversation et obtenir des conseils médicaux instantanés
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginTop: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4CAF50' }}></div>
              <span>Réponses instantanées</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2196F3' }}></div>
              <span>Informations médicales fiables</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF9800' }}></div>
              <span>Support continu 24h/24 et 7j/7</span>
            </div>
          </div>
          <p style={{ marginTop: '15px', fontWeight: 'bold', color: '#B2FF59' }}>
            {backendMessage}
          </p>
        </div>
      </div>

      {/* Floating Chat Bubble - This floats over EVERYTHING */}
      <FloatingChatBubble />
    </div>
  );
}

export default App;
