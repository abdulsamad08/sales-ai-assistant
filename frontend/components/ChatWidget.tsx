"use client";
import { useEffect, useState, useRef } from 'react';
import { Send, MessageSquare, User, Bot, Loader2, Quote, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  sources?: string[];
  timestamp: Date;
}

interface ChatWidgetProps {
  leadId: string;
  apiUrl: string;
  wsUrl: string;
}

export default function ChatWidget({ leadId, apiUrl, wsUrl }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 1. Fetch history
    fetch(`${apiUrl}/api/ai/chat/history/${leadId}/`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((t: any) => ({
          id: t.id,
          role: 'user',
          content: t.user_message,
          timestamp: new Date(t.created_at)
        })).flatMap((m: any, i: number) => [
          m,
          {
            id: `assistant-${i}`,
            role: 'assistant',
            content: data[i].ai_response,
            intent: data[i].intent,
            timestamp: new Date(data[i].created_at)
          }
        ]);
        setMessages(formatted);
      });

    // 2. Setup WebSocket
    const ws = new WebSocket(`${wsUrl}/ws/chat/${leadId}/`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'typing') {
        if (data.lead_id === 'assistant') {
          setIsTyping(data.is_typing);
        }
        return;
      }

      // It's a message response
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: data.content,
        intent: data.intent,
        sources: data.sources,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    };

    return () => ws.close();
  }, [leadId, apiUrl, wsUrl]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return;
    
    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    
    wsRef.current.send(JSON.stringify({
      message: input,
      type: 'message'
    }));

    setInput('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, fontFamily: 'inherit' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              width: '400px',
              height: '600px',
              backgroundColor: 'white',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              marginBottom: '1rem'
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: '#3b82f6', padding: '0.5rem', borderRadius: '12px' }}>
                  <Bot size={24} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 600 }}>Container Sales Assistant</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', opacity: 0.8 }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }}></div>
                    Live Sales Support
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f8fafc' }}
            >
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>
                  <Bot size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                  <p>Hi! Ask me anything about container sizes, pricing, or delivery!</p>
                </div>
              )}
              {messages.map((m) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={m.id} 
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    backgroundColor: m.role === 'user' ? '#3b82f6' : 'white',
                    color: m.role === 'user' ? 'white' : '#1e293b',
                    padding: '1rem',
                    borderRadius: m.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    boxShadow: m.role === 'assistant' ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none',
                    border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none'
                  }}
                >
                  <p style={{ fontSize: '0.925rem', whiteSpace: 'pre-wrap' }}>{m.content}</p>
                  
                  {m.sources && m.sources.length > 0 && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid currentColor', opacity: 0.5, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {m.sources.map((s, idx) => (
                        <span key={idx} style={{ fontSize: '0.65rem', border: '1px solid currentColor', padding: '0.15rem 0.4rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Quote size={10} /> {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {m.intent === 'conversion' && (
                    <div style={{ marginTop: '0.75rem', backgroundColor: '#eff6ff', padding: '0.5rem', borderRadius: '8px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#1d4ed8' }}>
                      <CheckCircle size={14} /> Sales handoff triggered
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', backgroundColor: 'white', padding: '1rem', borderRadius: '18px 18px 18px 2px', display: 'flex', gap: '0.25rem' }}>
                  <span className="dot-typing"></span>
                  <span className="dot-typing" style={{ animationDelay: '0.2s' }}></span>
                  <span className="dot-typing" style={{ animationDelay: '0.4s' }}></span>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: '1.25rem', borderTop: '1px solid #e2e8f0', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about containers..."
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '0.925rem'
                  }}
                />
                <button 
                  onClick={sendMessage}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#0f172a',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          float: 'right'
        }}
      >
        {isOpen ? <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>×</span> : <MessageSquare size={28} />}
      </motion.button>
      
      <style jsx>{`
        .dot-typing {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #cbd5e1;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
}
