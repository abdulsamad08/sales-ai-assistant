"use client";
import ChatWidget from '@/components/ChatWidget';
import { Truck, ShieldCheck, Scale, ArrowRight, Package, CheckCircle, Globe, Ship } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';

const containers = [
  {
    name: "20ft Standard",
    price: "$2,100",
    slug: "versatile",
    image: "/images/20ft.png",
  },
  {
    name: "40ft Standard",
    price: "$3,850",
    slug: "volume",
    image: "/images/40ft.png",
  },
  {
    name: "40ft High Cube",
    price: "$4,200",
    slug: "height",
    image: "/images/40ft_hc.png",
  }
];

export default function Home() {
  const leadId = typeof window !== 'undefined' ? "lead_" + Math.random().toString(36).substring(7) : "lead_ssr";
  
  // Vercel-style mouse spotlight
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

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Subtle Mouse Glow */}
      <motion.div 
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: useTransform(
            [springX, springY],
            ([x, y]) => `radial-gradient(800px circle at ${x}px ${y}px, rgba(255,255,255,0.03), transparent 80%)`
          )
        }}
      />

      {/* Sleek Navigation */}
      <nav style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, 
        padding: '1.25rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#fff', padding: '0.4rem', borderRadius: '8px' }}>
            <Ship size={18} color="#000" />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>MEMOX AI</span>
        </div>
        
        <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.85rem', fontWeight: 500, color: '#a1a1aa' }}>
          <span style={{ cursor: 'pointer' }} className="nav-item">Fleet</span>
          <span style={{ cursor: 'pointer' }} className="nav-item">Documentation</span>
          <button style={{ 
            backgroundColor: '#fff', color: '#000', padding: '0.5rem 1rem', 
            borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' 
          }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Minimalist Hero */}
      <section style={{ 
        position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem', zIndex: 1 
      }}>
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div style={{ color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            Built for Industry Leaders
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '2rem' }}>
            Shipping container sales,<br/>
            architected for speed.
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#a1a1aa', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Ask questions, get instant availability, and deploy units nationwide. <br/>
            Zero friction logistics powered by Gemini AI.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button style={{ backgroundColor: '#fff', color: '#000', padding: '0.85rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>
               Browse Fleet
            </button>
            <button style={{ backgroundColor: 'transparent', color: '#fff', padding: '0.85rem 2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>
               Chat with Assistant
            </button>
          </div>
        </motion.div>
      </section>

      {/* Sleek Grid */}
      <section style={{ padding: '0 3rem 10rem', position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {containers.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', 
                overflow: 'hidden', padding: '1rem'
              }}
            >
              <div style={{ height: '280px', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
              </div>
              <div style={{ padding: '1.5rem 0.5rem 0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{c.name}</h3>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{c.price}</span>
                </div>
                <button style={{ 
                  width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', 
                  backgroundColor: '#fff', color: '#000', fontWeight: 600, cursor: 'pointer'
                }}>
                   Select Container
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Minimal Footer */}
      <footer style={{ padding: '4rem 3rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#71717a', fontSize: '0.8rem', textAlign: 'center' }}>
         <div>© 2026 MEMOX AI — THE NEW STANDARD IN STEEL TRADING</div>
      </footer>

      {/* Chat Component */}
      <ChatWidget 
        leadId={leadId} 
        apiUrl="http://localhost:8000" 
        wsUrl="ws://localhost:8000"
      />

      <style jsx global>{`
        body { margin: 0; background: #000; -webkit-font-smoothing: antialiased; }
        .nav-item:hover { color: #fff !important; }
      `}</style>
    </div>
  );
}
