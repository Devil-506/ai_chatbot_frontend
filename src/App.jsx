// App.jsx - UPDATED
import React, { useEffect, useState } from 'react';
import FloatingChatBubble from './components/FloatingChatBubble';
import axios from 'axios';

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

  // Modern color palette
  const colors = {
    primary: '#6366F1',    // Indigo
    primaryLight: '#8B5CF6', // Light purple
    secondary: '#06D6A0',   // Teal
    accent: '#F59E0B',      // Amber
    emergency: '#EF4444',   // Red
    background: '#0F172A',  // Dark blue
    surface: '#1E293B',     // Lighter dark blue
    text: '#F8FAFC',        // Light text
    textMuted: '#94A3B8',   // Muted text
  };

  const services = [
    {
      icon: '🩺',
      title: 'Diagnostic Intelligent',
      description: 'Analyse avancée de vos symptômes avec IA médicale',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '💊',
      title: 'Guide Médicamenteux',
      description: 'Informations complètes sur les médicaments et interactions',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '📊',
      title: 'Suivi Santé',
      description: 'Surveillance continue de vos indicateurs de santé',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: '👨‍⚕️',
      title: 'Conseils Experts',
      description: 'Recommandations personnalisées par domaines médicaux',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: '🔄',
      title: 'Services 24/7',
      description: 'Assistance médicale continue à tout moment',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: '🔒',
      title: 'Confidentialité',
      description: 'Vos données médicales sécurisées et privées',
      gradient: 'from-gray-600 to-blue-600'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.background} 0%, #1E40AF 100%)`,
      color: colors.text,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(6, 214, 160, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)`,
        zIndex: 0
      }} />

      {/* Header Section */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
          borderRadius: '50%',
          margin: '0 auto 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '50px',
          boxShadow: `0 20px 40px rgba(99, 102, 241, 0.3)`,
          animation: 'float 6s ease-in-out infinite'
        }}>
          ⚕️
        </div>
        
        <h1 style={{
          fontSize: '4rem',
          marginBottom: '16px',
          fontWeight: 800,
          background: `linear-gradient(135deg, ${colors.text}, ${colors.primaryLight})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          ConnectCare
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          color: colors.textMuted,
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px',
          lineHeight: 1.6
        }}>
          Soins de santé nouvelle génération, intelligents et accessibles
        </p>

        {/* Status Indicator */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          background: colors.surface,
          borderRadius: '50px',
          border: `1px solid rgba(255,255,255,0.1)`,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: isLoading ? colors.accent : '#10B981',
            animation: isLoading ? 'pulse 2s infinite' : 'none'
          }} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>
            {backendMessage}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        padding: '60px 20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Services Grid */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            marginBottom: '60px',
            fontWeight: 700,
            color: colors.text
          }}>
            Nos Services Innovants
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {services.map((service, index) => (
              <div
                key={index}
                style={{
                  background: `linear-gradient(135deg, ${colors.surface}, rgba(30, 41, 59, 0.8))`,
                  padding: '40px 30px',
                  borderRadius: '20px',
                  border: `1px solid rgba(255,255,255,0.1)`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-10px)';
                  e.target.style.boxShadow = `0 25px 50px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {/* Gradient overlay on hover */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  transform: 'scaleX(0)',
                  transition: 'transform 0.3s ease'
                }} />
                
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '20px',
                  filter: 'grayscale(0.2)'
                }}>
                  {service.icon}
                </div>
                
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '16px',
                  fontWeight: 600,
                  color: colors.text
                }}>
                  {service.title}
                </h3>
                
                <p style={{
                  color: colors.textMuted,
                  lineHeight: 1.6,
                  fontSize: '1rem'
                }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Section */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{
            background: `linear-gradient(135deg, ${colors.emergency}, #DC2626)`,
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: `0 20px 40px rgba(239, 68, 68, 0.3)`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              animation: 'pulse 4s ease-in-out infinite'
            }} />
            
            <h3 style={{
              fontSize: '2rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              position: 'relative',
              zIndex: 2
            }}>
              <span style={{ fontSize: '2.5rem', animation: 'shake 2s ease-in-out infinite' }}>
                🚨
              </span>
              Urgences Médicales
            </h3>
            
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '30px',
              position: 'relative',
              zIndex: 2
            }}>
              En cas d'urgence vitale, contactez immédiatement les services d'urgence
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '20px 30px',
                borderRadius: '15px',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>
                📞 190
              </div>
              
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '20px 30px',
                borderRadius: '15px',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>
                🏥 150
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant Info */}
        <section>
          <div style={{
            background: `linear-gradient(135deg, ${colors.surface}, rgba(30, 41, 59, 0.9))`,
            padding: '50px 40px',
            borderRadius: '20px',
            textAlign: 'center',
            border: `1px solid rgba(255,255,255,0.1)`,
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              fontSize: '2rem',
              marginBottom: '20px',
              color: colors.secondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <span style={{ fontSize: '2.5rem', animation: 'bounce 2s ease-in-out infinite' }}>
                🤖
              </span>
              Assistant Médical IA
            </h3>
            
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '30px',
              color: colors.textMuted,
              maxWidth: '800px',
              margin: '0 auto 30px',
              lineHeight: 1.6
            }}>
              Notre assistant IA avancé vous offre des conseils médicaux instantanés, 
              une analyse intelligente de symptômes et un support personnalisé 24h/24
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {[
                { icon: '⚡', text: 'Réponses instantanées' },
                { icon: '🎯', text: 'Précision médicale' },
                { icon: '🛡️', text: 'Données sécurisées' },
                { icon: '🌐', text: 'Support multilingue' }
              ].map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '20px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <span style={{ fontSize: '2rem' }}>{feature.icon}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Global Styles */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
        `}
      </style>

      {/* Floating Chat Bubble */}
      <FloatingChatBubble />
    </div>
  );
}

export default App;
