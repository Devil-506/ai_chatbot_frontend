import React, { useEffect, useState } from 'react';
import FloatingChatBubble from './components/FloatingChatBubble';
import axios from 'axios';

function App() {
  const [backendMessage, setBackendMessage] = useState('worst designer...');

  useEffect(() => {
    // Fetch from Render backend using env variable
    axios.get('https://ai-chatbot-backend-ouvg.onrender.com/api')
  .then(res => console.log(res.data))
  .catch(err => console.log(err));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Your Existing Website Content */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Ghayth_connect💪</h1>
        <p style={{ fontSize: '1.3rem' }}>Connect_care!</p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '40px',
        borderRadius: '15px',
        maxWidth: '1000px',
        margin: '0 auto',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>to modify</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px' }}>
            <h3>random 1</h3>
            <p>same</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px' }}>
            <h3>random 2</h3>
            <p>same</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px' }}>
            <h3>random 3</h3>
            <p>same</p>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.15)', 
          padding: '20px', 
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3>Connect_care aibot_wedget</h3>
          <p>انقر على الزر العائم في الزاوية لفتح المساعد الطبي!</p>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>
            يمكنك سحب الشات وتحريكه في أي مكان على الشاشة
          </p>
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
            رسالة من الخادم: {backendMessage}
          </p>
        </div>
      </div>

      {/* Floating Chat Bubble - This floats over EVERYTHING */}
      <FloatingChatBubble />
    </div>
  );
}

export default App;




