"use client";
import ChatWidget, { ChatWidgetHandle } from '@/components/ChatWidget';
import { Truck, ShieldCheck, Scale, ArrowRight, Package, CheckCircle, Globe, Ship, Zap, ChevronRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const containers = [
  {
    name: "20ft Standard",
    price: "$2,100",
    slug: "20ft-standard",
    features: ["Wind & Water Tight", "Original Floors", "Cargo Worthy"],
    image: "/images/20ft.png",
    color: "#3b82f6"
  },
  {
    name: "40ft Standard",
    price: "$3,850",
    slug: "40ft-standard",
    features: ["Double Capacity", "Secure Locking", "Home Ready"],
    image: "/images/40ft.png",
    color: "#60a5fa"
  },
  {
    name: "40ft High Cube",
    price: "$4,200",
    slug: "40ft-hc",
    features: ["9'6\" Vertical Height", "Better Ventilation", "Ready for mods"],
    image: "/images/40ft_hc.png",
    color: "#2dd4bf"
  }
];

export default function Home() {
  const leadId = typeof window !== 'undefined' ? "lead_" + Math.random().toString(36).substring(7) : "lead_ssr";
  const chatRef = useRef<ChatWidgetHandle>(null);
  
  // Sleek mouse interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const selectContainer = (name: string) => {
    if (chatRef.current) {
      chatRef.current.sendMessage(`I'm interested in the ${name}. Can you tell me more about its availability?`);
    }
  };

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>
      {/* Precision Glow Underlay */}
      <motion.div 
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: useTransform(
            [springX, springY],
            ([x, y]) => `radial-gradient(1000px circle at ${x}px ${y}px, rgba(59,130,246,0.04), transparent 80%)`
          )
        }}
      />

      {/* Elite Header */}
      <nav style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, 
        padding: '1.25rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', background: 'rgba(5,5,5,0.5)'
      }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: '#fff', padding: '0.4rem', borderRadius: '10px' }}>
            <Ship size={20} color="#000" />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.06em' }}>HELIX<span style={{ color: '#3b82f6' }}>.</span></span>
        </motion.div>
        
        <div style={{ display: 'flex', gap: '3.5rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#666' }}>
          <span style={{ cursor: 'pointer', transition: '0.2s' }} className="nav-item">Fleet</span>
          <span style={{ cursor: 'pointer', transition: '0.2s' }} className="nav-item">Regions</span>
          <span style={{ cursor: 'pointer', transition: '0.2s' }} className="nav-item">How to Buy</span>
          <button style={{ 
            backgroundColor: '#fff', color: '#000', padding: '0.6rem 1.5rem', 
            borderRadius: '10px', border: 'none', fontWeight: 900, cursor: 'pointer',
            fontSize: '0.7rem'
          }}>
            Admin Portal
          </button>
        </div>
      </nav>

      {/* Modern Hero */}
      <section style={{ 
        position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem', zIndex: 1 
      }}>
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ color: '#3b82f6', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.25em', marginBottom: '2.5rem', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }} />
            2026 Fleet Availability
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 12vw, 6.5rem)', fontWeight: 950, letterSpacing: '-0.06em', lineHeight: 0.9, marginBottom: '2.5rem' }}>
            Steel logistics,<br/>
            <span style={{ color: 'transparent', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(to right, #fff, #444)' }}>
              defined by AI.
            </span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#666', maxWidth: '650px', margin: '0 auto 4rem', lineHeight: 1.6, fontWeight: 500 }}>
            The new international standard for container trading. Instant pricing, 
            verified structural integrity, and fully automated delivery routing.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              style={{ backgroundColor: '#fff', color: '#000', padding: '1.25rem 3.5rem', borderRadius: '16px', border: 'none', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,255,255,0.1)' }}
            >
               Browse Fleet
            </motion.button>
            <button 
              onClick={() => chatRef.current?.open()}
              style={{ backgroundColor: 'transparent', color: '#fff', padding: '1.25rem 3.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', backdropFilter: 'blur(20px)' }}
            >
               Ask about containers
            </button>
          </div>
        </motion.div>
      </section>

      {/* Unit Grid: High Precision Cards */}
      <section style={{ padding: '0 4rem 15rem', position: 'relative', zIndex: 1, maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {containers.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.05)', 
                overflow: 'hidden', padding: '1.5rem', transition: 'all 0.3s'
              }}
              className="unit-card"
            >
              <div style={{ height: '320px', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
                <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} className="card-image" />
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', color: '#fff', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                  {c.price}
                </div>
              </div>
              <div style={{ padding: '2rem 1rem 1rem' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>{c.name}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3rem' }}>
                   {c.features.map((f, j) => (
                     <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#666', fontSize: '0.9rem', fontWeight: 700 }}>
                        <div style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%' }} /> {f}
                     </div>
                   ))}
                </div>

                <motion.button 
                  whileHover={{ gap: '1rem' }}
                  onClick={() => selectContainer(c.name)}
                  style={{ 
                    width: '100%', padding: '1.25rem', borderRadius: '20px', border: 'none', 
                    backgroundColor: '#fff', color: '#000', fontWeight: 900, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    transition: 'all 0.2s', fontSize: '1rem'
                  }}
                >
                   Select for Inspection <ChevronRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Minimalistic Stats */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '6rem 0' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center' }}>
            <div>
               <div style={{ fontSize: '2.5rem', fontWeight: 950 }}>12k+</div>
               <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#3b82f6', marginTop: '0.5rem', letterSpacing: '0.1em' }}>CONTAINERS SOLD</div>
            </div>
            <div>
               <div style={{ fontSize: '2.5rem', fontWeight: 950 }}>4.9</div>
               <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#3b82f6', marginTop: '0.5rem', letterSpacing: '0.1em' }}>AVG RATING</div>
            </div>
            <div>
               <div style={{ fontSize: '2.5rem', fontWeight: 950 }}>48h</div>
               <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#3b82f6', marginTop: '0.5rem', letterSpacing: '0.1em' }}>DELIVERY SPEED</div>
            </div>
            <div>
               <div style={{ fontSize: '2.5rem', fontWeight: 950 }}>50</div>
               <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#3b82f6', marginTop: '0.5rem', letterSpacing: '0.1em' }}>REGIONS COVERED</div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '8rem 4rem', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505' }}>
         <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#444', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
           Helix Advanced Logistics © 2026 — Verified by Gemini
         </div>
      </footer>

      {/* Chat Component Attached to Ref */}
      <ChatWidget 
        ref={chatRef}
        leadId={leadId} 
        apiUrl="http://localhost:8000" 
        wsUrl="ws://localhost:8000"
      />

      <style jsx global>{`
        body { margin: 0; background: #050505; -webkit-font-smoothing: antialiased; }
        .nav-item:hover { color: #fff !important; }
        .unit-card:hover { border-color: rgba(255,255,255,0.15) !important; background: rgba(255,255,255,0.03) !important; }
        .card-image { transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .unit-card:hover .card-image { transform: scale(1.05); }
      `}</style>
    </div>
  );
}
