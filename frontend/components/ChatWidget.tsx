"use client";
import { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Send, MessageSquare, User, Bot, Loader2, Quote, CheckCircle, Mic, Volume2, VolumeX } from 'lucide-react';
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

export interface ChatWidgetHandle {
  sendMessage: (text: string) => void;
  open: () => void;
}

const ChatWidget = forwardRef<ChatWidgetHandle, ChatWidgetProps>(({ leadId, apiUrl, wsUrl }, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    sendMessage: (text: string) => {
      setIsOpen(true);
      handleSendMessage(text);
    },
    open: () => setIsOpen(true)
  }));

  // Text-to-Speech Engine
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis && !isMuted) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech-to-Text Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleSendMessage(transcript);
          setIsListening(false);
        };
        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
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

    const ws = new WebSocket(`${wsUrl}/ws/chat/${leadId}/`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'typing') {
        if (data.lead_id === 'assistant') setIsTyping(data.is_typing);
        return;
      }
      
      const content = data.content;
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content,
        intent: data.intent,
        sources: data.sources,
        timestamp: new Date()
      }]);
      setIsTyping(false);
      
      // Auto-speak response
      if (typeof window !== 'undefined') speak(content);
    };

    return () => ws.close();
  }, [leadId, apiUrl, wsUrl, isMuted]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim() || !wsRef.current) return;
    
    // Stop speaking user interrupts or starts new query
    if (typeof window !== 'undefined') window.speechSynthesis.cancel();

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    
    wsRef.current.send(JSON.stringify({
      message: text,
      type: 'message'
    }));

    if (!textOverride) setInput('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={{
              width: '420px', height: '650px', backgroundColor: '#0f172a', borderRadius: '32px',
              boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
              overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem'
            }}
          >
            {/* Header */}
            <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', padding: '0.6rem', borderRadius: '14px' }}>
                    <Bot size={24} color="white" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', marginLeft: '1rem' }}>MESSAGING...</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <motion.div 
                      whileTap={{ scale: 0.8 }}
                      onClick={() => setIsMuted(!isMuted)}
                      style={{ cursor: 'pointer', padding: '0.6rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
                    >
                      {isMuted ? <VolumeX size={18} color="#64748b" /> : <Volume2 size={18} color="#3b82f6" />}
                    </motion.div>
                    <motion.div 
                      animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                      onClick={toggleVoiceInput}
                      style={{ cursor: 'pointer', padding: '0.6rem', borderRadius: '50%', background: isListening ? '#3b82f6' : 'rgba(255,255,255,0.05)' }}
                    >
                      <Mic size={18} color={isListening ? 'white' : '#64748b'} />
                    </motion.div>
                </div>
              </div>
            </div>

            {/* Chat Space */}
            <div 
              ref={scrollRef}
              style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              {messages.map((m) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={m.id} 
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    backgroundColor: m.role === 'user' ? '#3b82f6' : 'rgba(255,255,255,0.03)',
                    color: 'white',
                    padding: '1.25rem',
                    borderRadius: m.role === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                  }}
                >
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{m.content}</p>
                </motion.div>
              ))}
              {isTyping && <div style={{ alignSelf: 'flex-start', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 900 }}>AI is thinking...</div>}
            </div>

            {/* Input */}
            <div style={{ padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '0.75rem' }}>
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="How can I help you?"
                  style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none', paddingLeft: '0.5rem' }}
                />
                <button onClick={() => handleSendMessage()} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.6rem', borderRadius: '14px', cursor: 'pointer' }}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '72px', height: '72px', borderRadius: '24px', backgroundColor: '#3b82f6',
          boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.5)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
        }}
      >
        {isOpen ? <span style={{ fontSize: '2rem' }}>×</span> : <MessageSquare size={32} />}
      </motion.button>
    </div>
  );
});

ChatWidget.displayName = "ChatWidget";
export default ChatWidget;
