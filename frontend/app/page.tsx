import ChatWidget from '@/components/ChatWidget';
import { ShippingContainer, Truck, MapPin, ShieldCheck, Scale, Ruler } from 'lucide-react';

export default function Home() {
  const leadId = "lead_" + Math.random().toString(36).substring(7);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Hero Section */}
      <section style={{ padding: '6rem 2rem', background: 'linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7)), url("https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=2070") center/cover', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>Premium Shipping Containers, Delivered.</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2.5rem' }}>We provide high-spec containers for storage, logistics, and custom modifications across the United States. Fast delivery, transparent pricing, and robust quality.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button style={{ backgroundColor: '#2563eb', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 600, border: 'none', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}>Get a Free Quote</button>
            <button style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}>View Dimensions</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: '1200px', margin: '6rem auto', padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        <div className="premium-card">
          <Truck className="text-blue-600" size={32} style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Nationwide Delivery</h3>
          <p style={{ color: '#64748b' }}>From Texas to Alaska, our tilt-bed trailer network ensures your container arrives exactly where you need it.</p>
        </div>
        <div className="premium-card">
          <ShieldCheck className="text-blue-600" size={32} style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Cargo Worthy Units</h3>
          <p style={{ color: '#64748b' }}>Every container is wind and water-tight inspected. We only sell what we would use ourselves.</p>
        </div>
        <div className="premium-card">
          <Scale className="text-blue-600" size={32} style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Custom Fabrication</h3>
          <p style={{ color: '#64748b' }}>Windows, doors, insulation, and paint. We turn steel boxes into offices, workspaces, and more.</p>
        </div>
      </section>

      {/* Chat Widget Demo Note */}
      <div style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>
        <p>This is a proof-of-concept landing page. The AI Sales Assistant is active in the bottom right.</p>
      </div>

      <ChatWidget 
        leadId={leadId} 
        apiUrl="http://localhost:8000" 
        wsUrl="ws://localhost:8000"
      />
    </main>
  );
}
