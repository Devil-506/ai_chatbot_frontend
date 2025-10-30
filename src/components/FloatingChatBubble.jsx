import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Plus, Trash2, Download, Menu, ThumbsUp, ThumbsDown } from 'lucide-react';
import io from 'socket.io-client';

const FloatingChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);
  const inputRef = useRef(null);

  // Medical quick actions in French
  const quickActions = [
    { emoji: '🤖', text: 'Consultation intelligente', prompt: 'J\'ai besoin d\'une consultation médicale intelligente concernant mon état de santé' },
    { emoji: '💊', text: 'Conseils pharmaceutiques', prompt: 'Je veux des conseils sur les médicaments appropriés et les dosages' },
    { emoji: '🩺', text: 'Analyse des symptômes', prompt: 'J\'ai ces symptômes, pouvez-vous les analyser et me donner des conseils ?' },
    { emoji: '❤️', text: 'Conseils préventifs', prompt: 'Quels sont les conseils intelligents pour prévenir les maladies ?' }
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
          text: '🤖 **Bonjour ! Je suis votre assistant médical intelligent.**\n\nJe suis ici pour vous aider dans vos questions médicales. Comment puis-je vous servir aujourd\'hui ?',
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  }, [messages]);

  // Enhanced dragging with perfect boundaries
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Perfect boundaries calculation
    const widgetWidth = isOpen ? 350 : 60;
    const widgetHeight = isOpen ? 500 : 60;
    
    const boundedX = Math.max(10, Math.min(newX, window.innerWidth - widgetWidth - 10));
    const boundedY = Math.max(10, Math.min(newY, window.innerHeight - widgetHeight - 10));
    
    setPosition({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Event listeners for dragging
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
    setIsOpen(!isOpen);
    setShowMenu(false);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const startNewChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'ai',
      text: '🤖 **Nouvelle Conversation**\n\nBonjour ! Je suis l\'assistant médical intelligent. Comment puis-je vous aider aujourd\'hui ?',
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
    a.download = `conversation-medicale-${new Date().toLocaleDateString()}.txt`;
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

  // Medical AI color scheme (purple theme from the image)
  const colors = {
    primary: '#667eea',    // Purple from the image
    secondary: '#764ba2',  // Dark purple from gradient
    lightBlue: '#E3F2FD',
    lightGreen: '#E8F5E8',
    white: '#FFFFFF',
    gray: '#666666',
    darkGray: '#333333'
  };

  return (
    <div
      ref={widgetRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        transition: isDragging ? 'none' : 'all 0.3s ease',
        transform: isDragging ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      {isOpen ? (
        /* Chat Window */
        <div style={{
          width: '350px',
          height: '500px',
          background: colors.white,
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: `1px solid ${colors.lightBlue}`,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          {/* Header - Draggable */}
          <div 
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: colors.white,
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: isDragging ? 'grabbing' : 'move',
              userSelect: 'none',
              flexShrink: 0
            }}
            onMouseDown={handleMouseDown}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                🤖
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '15px' }}>
                  Assistant Médical Intelligent
                </div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                  {isConnected ? '🟢 Connecté' : '🔴 Déconnecté'}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={startNewChat}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: colors.white,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                title="Nouvelle conversation"
              >
                <Plus size={16} />
              </button>

              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: colors.white,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <Menu size={16} />
              </button>

              <button
                onClick={toggleChat}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: colors.white,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Dropdown Menu */}
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '72px',
              right: '16px',
              background: colors.white,
              borderRadius: '8px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.1)',
              zIndex: 1000,
              padding: '6px',
              minWidth: '160px'
            }}>
              <button
                onClick={exportChat}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: colors.darkGray,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = colors.lightBlue}
              >
                <Download size={14} />
                Exporter la conversation
              </button>
              
              <button
                onClick={clearChat}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: colors.darkGray,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = colors.lightBlue}
              >
                <Trash2 size={14} />
                Effacer la conversation
              </button>
            </div>
          )}

          {/* Clear Chat Confirmation */}
          {showClearConfirm && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: colors.white,
              borderRadius: '12px',
              boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
              padding: '20px',
              zIndex: 1001,
              textAlign: 'center',
              border: '1px solid rgba(0,0,0,0.1)',
              width: '280px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: colors.darkGray }}>
                🗑️ Effacer la conversation
              </div>
              <div style={{ fontSize: '13px', color: colors.gray, marginBottom: '16px' }}>
                Êtes-vous sûr de vouloir effacer cette conversation ?
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={cancelClear}
                  style={{
                    padding: '8px 16px',
                    background: colors.lightBlue,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: colors.primary
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmClear}
                  style={{
                    padding: '8px 16px',
                    background: '#ef4444',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: colors.white
                  }}
                >
                  Oui, effacer
                </button>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            background: colors.lightBlue,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {messages.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: colors.gray, 
                padding: '30px 16px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '28px',
                  color: colors.white
                }}>
                  🤖
                </div>
                <h3 style={{ fontWeight: '600', marginBottom: '6px', color: colors.primary }}>
                  Assistant Médical Intelligent
                </h3>
                <p style={{ fontSize: '13px', marginBottom: '24px', lineHeight: '1.4' }}>
                  Posez n'importe quelle question médicale et je vous répondrai instantanément avec l'intelligence artificielle
                </p>
                
                {/* Emergency Banner */}
                <div style={{
                  background: `linear-gradient(135deg, ${colors.secondary}, #2E7D32)`,
                  color: colors.white,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  🚨 Urgence : Appelez le 190
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.prompt)}
                      style={{
                        background: colors.white,
                        border: `1px solid ${colors.lightBlue}`,
                        borderRadius: '12px',
                        padding: '14px 6px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: '600',
                        transition: 'all 0.2s',
                        color: colors.primary
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = colors.primary;
                        e.target.style.color = colors.white;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = colors.white;
                        e.target.style.color = colors.primary;
                      }}
                    >
                      <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                        {action.emoji}
                      </div>
                      <div>{action.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                      flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: message.type === 'user' ? colors.primary : colors.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: colors.white,
                      fontSize: '14px'
                    }}>
                      {message.type === 'user' ? '👤' : '🤖'}
                    </div>
                    
                    {/* Message Bubble */}
                    <div style={{
                      background: message.type === 'user' ? colors.primary : colors.white,
                      color: message.type === 'user' ? colors.white : colors.darkGray,
                      padding: '12px 14px',
                      borderRadius: message.type === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      maxWidth: '75%',
                      border: message.type === 'user' ? 'none' : `1px solid ${colors.lightBlue}`,
                      fontSize: '13px',
                      lineHeight: '1.4',
                      wordWrap: 'break-word'
                    }}>
                      {message.text}
                      
                      {/* Rating Buttons */}
                      {message.type === 'ai' && !message.isStreaming && (
                        <div style={{ 
                          display: 'flex', 
                          gap: '6px', 
                          marginTop: '10px'
                        }}>
                          <button
                            onClick={() => rateResponse(message.id, 'like')}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              border: '1px solid #d1d5db',
                              background: message.rating === 'like' ? colors.secondary : colors.white,
                              color: message.rating === 'like' ? colors.white : colors.gray,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <ThumbsUp size={10} />
                          </button>
                          
                          <button
                            onClick={() => rateResponse(message.id, 'dislike')}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              border: '1px solid #d1d5db',
                              background: message.rating === 'dislike' ? '#ef4444' : colors.white,
                              color: message.rating === 'dislike' ? colors.white : colors.gray,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <ThumbsDown size={10} />
                          </button>
                        </div>
                      )}
                      
                      {/* Typing Indicator */}
                      {message.isStreaming && (
                        <div style={{ display: 'flex', gap: '3px', marginTop: '6px' }}>
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: message.type === 'user' ? 'rgba(255,255,255,0.6)' : colors.gray,
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

          {/* Input Area */}
          <div style={{
            padding: '16px',
            borderTop: `1px solid ${colors.lightBlue}`,
            background: colors.white,
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                  padding: '12px 14px',
                  border: `1px solid ${colors.lightBlue}`,
                  borderRadius: '10px',
                  outline: 'none',
                  fontSize: '13px',
                  background: colors.lightBlue,
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.background = colors.white;
                  e.target.style.borderColor = colors.primary;
                }}
                onBlur={(e) => {
                  e.target.style.background = colors.lightBlue;
                  e.target.style.borderColor = colors.lightBlue;
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading || !isConnected}
                style={{
                  width: '44px',
                  height: '44px',
                  background: colors.secondary,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '10px',
                  cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  opacity: inputMessage.trim() ? 1 : 0.6
                }}
              >
                <Send size={16} />
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '10px', color: colors.gray }}>
                ⚕️ Cet assistant ne remplace pas une consultation avec un médecin spécialisé
              </span>
            </div>
          </div>

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
            `}
          </style>
        </div>
      ) : (
        /* Floating Button with AI Bot Icon */
        <div
          onMouseDown={handleMouseDown}
          onClick={toggleChat}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '14px',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            color: colors.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
            border: `2px solid ${colors.white}`,
            fontSize: '24px',
            transition: 'all 0.3s ease',
            userSelect: 'none'
          }}
        >
          🤖
          {isConnected && (
            <div style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#4CAF50',
              border: `2px solid ${colors.white}`
            }} />
          )}
          {messages.length > 1 && (
            <div style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#FF9800',
              color: 'white',
              fontSize: '9px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${colors.white}`
            }}>
              {messages.filter(m => m.type === 'user').length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingChatBubble;
