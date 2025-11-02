// FloatingChatBubble.jsx - UPDATED with return-to-corner behavior
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Plus, Trash2, Download, Menu, ThumbsUp, ThumbsDown, Bot, User, Shield } from 'lucide-react';
import io from 'socket.io-client';

const FloatingChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: 40 }); // Start in right corner
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);
  const inputRef = useRef(null);

  // Modern color scheme
  const colors = {
    primary: '#6366F1',
    primaryLight: '#8B5CF6',
    secondary: '#06D6A0',
    accent: '#F59E0B',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceLight: '#334155',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    border: '#475569',
    error: '#EF4444',
    success: '#10B981'
  };

  // Enhanced quick actions
  const quickActions = [
    { 
      emoji: '🩺', 
      text: 'Diagnostic IA', 
      prompt: 'J\'ai besoin d\'une analyse médicale intelligente de mes symptômes',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      emoji: '💊', 
      text: 'Médicaments', 
      prompt: 'Je veux des informations sur les médicaments et leurs effets',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      emoji: '📋', 
      text: 'Analyse Symptômes', 
      prompt: 'Pouvez-vous analyser ces symptômes et me conseiller ?',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      emoji: '🛡️', 
      text: 'Prévention', 
      prompt: 'Quelles sont les mesures préventives pour maintenir une bonne santé ?',
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Connect to backend
  useEffect(() => {
    const newSocket = io('https://ai-chatbot-backend-ouvg.onrender.com');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      if (messages.length === 0) {
        setMessages([{
          id: Date.now(),
          type: 'ai',
          text: '**🩺 Bonjour ! Je suis votre assistant médical IA.**\n\nJe suis ici pour vous accompagner dans vos questions de santé. Parlez-moi de vos symptômes, demandez des informations médicales, ou utilisez les actions rapides ci-dessous.',
          timestamp: new Date()
        }]);
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('streaming_response', (data) => {
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        
        if (lastMessage && lastMessage.type === 'ai' && data.partial) {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...lastMessage,
            text: data.text,
            isStreaming: true,
            timestamp: new Date()
          };
          return updated;
        } else if (!data.partial) {
          if (lastMessage && lastMessage.type === 'ai') {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...lastMessage,
              text: data.text,
              isStreaming: false,
              timestamp: new Date()
            };
            return updated;
          } else {
            return [...prev, {
              id: Date.now(),
              type: 'ai',
              text: data.text,
              isStreaming: false,
              timestamp: new Date()
            }];
          }
        }
        return prev;
      });
      setIsLoading(false);
    });

    return () => newSocket.close();
  }, []);

  // Perfect auto-scroll
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  }, [messages, isOpen]);

  // Enhanced dragging with return-to-corner behavior
  const handleMouseDown = (e) => {
    if (isOpen) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isOpen) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    const widgetWidth = 400;
    const widgetHeight = isMinimized ? 80 : 600;
    
    const boundedX = Math.max(10, Math.min(newX, window.innerWidth - widgetWidth - 10));
    const boundedY = Math.max(10, Math.min(newY, window.innerHeight - widgetHeight - 10));
    
    setPosition({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Return to corner behavior
    const widgetWidth = isOpen ? 400 : 70;
    const threshold = 100; // Distance from edge to trigger return
    
    // Check if close to right edge
    if (position.x > window.innerWidth - widgetWidth - threshold) {
      setPosition({
        x: window.innerWidth - widgetWidth - 20,
        y: position.y
      });
    }
    // Check if close to left edge
    else if (position.x < threshold) {
      setPosition({
        x: 20,
        y: position.y
      });
    }
    // If in middle, check which edge is closer
    else {
      const distanceToRight = window.innerWidth - position.x - widgetWidth;
      const distanceToLeft = position.x;
      
      if (distanceToRight < distanceToLeft) {
        // Closer to right edge
        setPosition({
          x: window.innerWidth - widgetWidth - 20,
          y: position.y
        });
      } else {
        // Closer to left edge
        setPosition({
          x: 20,
          y: position.y
        });
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  const sendMessage = () => {
    if (!inputMessage.trim() || isLoading || !isConnected) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    socket.emit('send_message', { message: inputMessage });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleQuickAction = (prompt) => {
    setInputMessage(prompt);
    setTimeout(() => sendMessage(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    const wasOpen = isOpen;
    setIsOpen(!isOpen);
    setShowMenu(false);
    
    if (!wasOpen && !isOpen) {
      // Opening the chat - ensure it's in the right corner
      setPosition({
        x: window.innerWidth - 400 - 20,
        y: Math.min(position.y, window.innerHeight - 600 - 20)
      });
      setTimeout(() => inputRef.current?.focus(), 300);
    } else if (wasOpen && !isOpen) {
      // Closing the chat - return bubble to right corner
      setPosition({
        x: window.innerWidth - 70 - 20,
        y: position.y
      });
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const startNewChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'ai',
      text: '**🔄 Nouvelle Conversation**\n\nBonjour ! Je suis votre assistant médical IA. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }]);
    setShowClearConfirm(false);
    setShowMenu(false);
  };

  const clearChat = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    startNewChat();
  };

  const cancelClear = () => {
    setShowClearConfirm(false);
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `${msg.type === 'user' ? '👤 Vous' : '🤖 Assistant'}: ${msg.text}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-medicale-${new Date().toLocaleDateString('fr-FR')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const rateResponse = (messageId, rating) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
  };

  // Handle window resize to keep bubble in right corner
  useEffect(() => {
    const handleResize = () => {
      if (!isOpen) {
        setPosition({
          x: window.innerWidth - 70 - 20,
          y: position.y
        });
      } else {
        setPosition({
          x: window.innerWidth - 400 - 20,
          y: Math.min(position.y, window.innerHeight - 600 - 20)
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, position.y]);

  return (
    <div
      ref={widgetRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 10000,
        transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isDragging ? 'scale(1.02) rotate(1deg)' : 'scale(1) rotate(0deg)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      {isOpen ? (
        /* Enhanced Chat Window */
        <div style={{
          width: '400px',
          height: isMinimized ? '80px' : '600px',
          background: colors.surface,
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: `1px solid ${colors.border}`,
          backdropFilter: 'blur(20px)',
          opacity: isMinimized ? 0.9 : 1
        }}>
          {/* Enhanced Header */}
          <div 
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
              color: colors.text,
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: isDragging ? 'grabbing' : 'move',
              userSelect: 'none',
              flexShrink: 0
            }}
            onMouseDown={handleMouseDown}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '2px' }}>
                  Assistant Médical IA
                </div>
                <div style={{ fontSize: '12px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isConnected ? colors.success : colors.error
                  }} />
                  {isConnected ? 'Connecté' : 'Déconnecté'}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={toggleMinimize}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: colors.text,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(10px)'
                }}
                title={isMinimized ? 'Agrandir' : 'Réduire'}
              >
                {isMinimized ? '+' : '−'}
              </button>

              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: colors.text,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Menu size={16} />
              </button>

              <button
                onClick={toggleChat}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: colors.text,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Enhanced Dropdown Menu */}
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '76px',
              right: '20px',
              background: colors.surfaceLight,
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: `1px solid ${colors.border}`,
              zIndex: 1000,
              padding: '8px',
              minWidth: '180px',
              backdropFilter: 'blur(20px)'
            }}>
              <button
                onClick={startNewChat}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  color: colors.text,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              >
                <Plus size={16} />
                Nouvelle conversation
              </button>
              
              <button
                onClick={exportChat}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  color: colors.text,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              >
                <Download size={16} />
                Exporter
              </button>
              
              <button
                onClick={clearChat}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  color: colors.error,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                <Trash2 size={16} />
                Effacer
              </button>
            </div>
          )}

          {/* Enhanced Clear Chat Confirmation */}
          {showClearConfirm && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: colors.surfaceLight,
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              padding: '24px',
              zIndex: 1001,
              textAlign: 'center',
              border: `1px solid ${colors.border}`,
              width: '300px',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: colors.text }}>
                🗑️ Effacer la conversation
              </div>
              <div style={{ fontSize: '14px', color: colors.textMuted, marginBottom: '20px', lineHeight: 1.5 }}>
                Êtes-vous sûr de vouloir effacer cette conversation ? Cette action est irréversible.
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={cancelClear}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255,255,255,0.1)',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: colors.text,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmClear}
                  style={{
                    padding: '10px 20px',
                    background: colors.error,
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: colors.text,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#DC2626'}
                >
                  Oui, effacer
                </button>
              </div>
            </div>
          )}

          {!isMinimized && (
            <>
              {/* Enhanced Messages Area */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                background: `linear-gradient(135deg, ${colors.background}, ${colors.surface})`,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {messages.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    color: colors.textMuted, 
                    padding: '40px 20px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '20px',
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      fontSize: '32px',
                      color: colors.text
                    }}>
                      <Bot size={32} />
                    </div>
                    <h3 style={{ fontWeight: 700, marginBottom: '8px', color: colors.text, fontSize: '18px' }}>
                      Assistant Médical IA
                    </h3>
                    <p style={{ fontSize: '14px', marginBottom: '30px', lineHeight: 1.5 }}>
                      Discutez avec votre assistant IA pour des conseils médicaux personnalisés
                    </p>
                    
                    {/* Emergency Banner */}
                    <div style={{
                      background: `linear-gradient(135deg, ${colors.error}, #DC2626)`,
                      color: colors.text,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      marginBottom: '24px',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <span>🚨</span>
                      Urgence : Appelez le 190
                    </div>

                    {/* Enhanced Quick Actions */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(action.prompt)}
                          style={{
                            background: colors.surfaceLight,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '14px',
                            padding: '16px 8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            color: colors.text,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`;
                            e.target.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = colors.surfaceLight;
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          <div style={{ fontSize: '20px' }}>
                            {action.emoji}
                          </div>
                          <div>{action.text}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start',
                          flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
                        }}
                      >
                        {/* Enhanced Avatar */}
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: message.type === 'user' 
                            ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`
                            : `linear-gradient(135deg, ${colors.secondary}, #10B981)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: colors.text,
                          fontSize: '14px'
                        }}>
                          {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        
                        {/* Enhanced Message Bubble */}
                        <div style={{
                          background: message.type === 'user' 
                            ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`
                            : colors.surfaceLight,
                          color: message.type === 'user' ? colors.text : colors.text,
                          padding: '14px 16px',
                          borderRadius: message.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          maxWidth: '75%',
                          border: message.type === 'user' ? 'none' : `1px solid ${colors.border}`,
                          fontSize: '14px',
                          lineHeight: 1.5,
                          wordWrap: 'break-word',
                          boxShadow: message.type === 'user' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          {message.text}
                          
                          {/* Enhanced Rating Buttons */}
                          {message.type === 'ai' && !message.isStreaming && (
                            <div style={{ 
                              display: 'flex', 
                              gap: '8px', 
                              marginTop: '12px'
                            }}>
                              <button
                                onClick={() => rateResponse(message.id, 'like')}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '8px',
                                  border: `1px solid ${colors.border}`,
                                  background: message.rating === 'like' ? colors.success : colors.surfaceLight,
                                  color: message.rating === 'like' ? colors.text : colors.textMuted,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <ThumbsUp size={12} />
                              </button>
                              
                              <button
                                onClick={() => rateResponse(message.id, 'dislike')}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '8px',
                                  border: `1px solid ${colors.border}`,
                                  background: message.rating === 'dislike' ? colors.error : colors.surfaceLight,
                                  color: message.rating === 'dislike' ? colors.text : colors.textMuted,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <ThumbsDown size={12} />
                              </button>
                            </div>
                          )}
                          
                          {/* Enhanced Typing Indicator */}
                          {message.isStreaming && (
                            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                              {[0, 1, 2].map(i => (
                                <div
                                  key={i}
                                  style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: colors.primary,
                                    animation: `bounce 1.4s infinite ${i * 0.2}s`
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Enhanced Input Area */}
              <div style={{
                padding: '20px',
                borderTop: `1px solid ${colors.border}`,
                background: colors.surface,
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre question médicale ici..."
                    disabled={isLoading || !isConnected}
                    style={{
                      flex: 1,
                      padding: '14px 16px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      outline: 'none',
                      fontSize: '14px',
                      background: colors.surfaceLight,
                      color: colors.text,
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                      e.target.style.background = colors.background;
                      e.target.style.borderColor = colors.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.background = colors.surfaceLight;
                      e.target.style.borderColor = colors.border;
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading || !isConnected}
                    style={{
                      width: '48px',
                      height: '48px',
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                      color: colors.text,
                      border: 'none',
                      borderRadius: '12px',
                      cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      opacity: inputMessage.trim() ? 1 : 0.6
                    }}
                  >
                    <Send size={18} />
                  </button>
                </div>
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '11px', color: colors.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Shield size={10} />
                    ⚕️ Cet assistant ne remplace pas une consultation médicale professionnelle
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Enhanced Floating Button - Always returns to right corner */
        <div
          onMouseDown={handleMouseDown}
          onClick={toggleChat}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '18px',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
            color: colors.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: `0 20px 40px rgba(99, 102, 241, 0.4)`,
            border: `2px solid rgba(255,255,255,0.2)`,
            fontSize: '28px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            userSelect: 'none',
            position: 'relative'
          }}
        >
          <Bot size={28} />
          
          {/* Connection Status Dot */}
          {isConnected && (
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: colors.success,
              border: `2px solid ${colors.surface}`,
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
          )}
          
          {/* Message Count Badge */}
          {messages.length > 1 && (
            <div style={{
              position: 'absolute',
              top: '6px',
              left: '6px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: colors.accent,
              color: colors.background,
              fontSize: '10px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${colors.surface}`,
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
            }}>
              {messages.filter(m => m.type === 'user').length}
            </div>
          )}
        </div>
      )}

      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { 
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% { 
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% { 
              opacity: 1;
              transform: scale(1);
            }
            50% { 
              opacity: 0.7;
              transform: scale(1.1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default FloatingChatBubble;
