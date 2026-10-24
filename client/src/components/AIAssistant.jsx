import React, { useState, useRef, useEffect } from 'react';

function AIAssistant({ location, summary, risk }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `👋 Namaste! I am **FloodLens AI Assistant**.\nI am actively monitoring **${location || 'India'}**.\n\nYou can ask me:\n- *"Is my area at flood risk?"*\n- *"What is today's rainfall in my locality?"*\n- *"What should I do in an emergency?"*\n- *"Explain Model A & Model B prediction"*`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            location,
            summary,
            risk
          }
        })
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.text || 'Unable to process query at this time.',
          suggestedActions: data.suggestedActions
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '⚠️ Network connection issue. If you are experiencing an emergency, please dial **112** (National Emergency) or **1078** (NDRF Control Room).'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1500
      }}>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50px',
              padding: '12px 20px',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.5), 0 8px 10px -6px rgba(2, 132, 199, 0.5)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={{ fontSize: '1.3rem' }}>🤖</span>
            <span>Ask FloodLens AI</span>
            <span style={{
              background: '#10b981',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              display: 'inline-block'
            }} />
          </button>
        )}
      </div>

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 32px)',
          height: '540px',
          maxHeight: 'calc(100vh - 48px)',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1600,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: '#0f172a',
            color: '#ffffff',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #1e293b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#0284c7',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                🤖
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>
                  FloodLens AI Assistant
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Active Locality: <strong style={{ color: '#e2e8f0' }}>{location || 'India'}</strong>
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.4rem',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              ×
            </button>
          </div>

          {/* Messages Container */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#f8fafc'
          }}>
            {messages.map((m, idx) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isAi ? 'flex-start' : 'flex-end',
                    maxWidth: '86%'
                  }}
                >
                  <div style={{
                    background: isAi ? '#ffffff' : '#0284c7',
                    color: isAi ? '#0f172a' : '#ffffff',
                    padding: '10px 14px',
                    borderRadius: isAi ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    boxShadow: isAi ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                    border: isAi ? '1px solid #e2e8f0' : 'none',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {m.text}
                  </div>

                  {/* Quick action buttons if AI suggests them */}
                  {isAi && m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                      {m.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleSend(action)}
                          style={{
                            background: '#e0f2fe',
                            color: '#0369a1',
                            border: '1px solid #bae6fd',
                            borderRadius: '12px',
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {loading && (
              <div style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>
                Analyzing hydrometeorological telemetry...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{
            padding: '8px 12px',
            background: '#ffffff',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            <button
              onClick={() => handleSend('Is my area at flood risk?')}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                color: '#334155'
              }}
            >
              🌊 Flood Risk?
            </button>
            <button
              onClick={() => handleSend('What is the rainfall today?')}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                color: '#334155'
              }}
            >
              🌧️ Rainfall Today
            </button>
            <button
              onClick={() => handleSend('Emergency Helpline numbers')}
              style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                color: '#991b1b',
                fontWeight: 600
              }}
            >
              🚨 Hotlines (112/1078)
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '10px 12px',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '8px'
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about floods or weather..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem'
              }}
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default AIAssistant;

