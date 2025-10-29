import React, { useEffect, useState } from 'react';
import FloatingChatBubble from './components/FloatingChatBubble';
import axios from 'axios';

function App() {
  const [backendMessage, setBackendMessage] = useState('جارٍ الاتصال بالخادم...');

  useEffect(() => {
    // Fetch from Render backend using env variable
    axios.get(`${import.meta.env.VITE_API_URL}/api`)
      .then(res => setBackendMessage(res.data.message))
      .catch(err => setBackendMessage('خطأ في الاتصال بالخادم: ' + err.message));
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
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>🌍 موقعي الرسمي</h1>
        <p style={{ fontSize: '1.3rem' }}>هذا موقع ويب عادي - الشات يظهر فوق كل شيء!</p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '40px',
        borderRadius: '15px',
        maxWidth: '1000px',
        margin: '0 auto',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>محتوى موقعك هنا</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px' }}>
            <h3>قسم 1</h3>
            <p>محتوى القسم الأول من موقعك...</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px' }}>
            <h3>قسم 2</h3>
            <p>محتوى القسم الثاني من موقعك...</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px' }}>
            <h3>قسم 3</h3>
            <p>محتوى القسم الثالث من موقعك...</p>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.15)', 
          padding: '20px', 
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3>💡 الشات الطبي العائم</h3>
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
