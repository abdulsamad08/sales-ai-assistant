"use client";
import { useEffect, useState } from 'react';
import { Database, FileText, CheckCircle2, AlertCircle, Play, RefreshCw } from 'lucide-react';

interface Document {
  id: number;
  title: string;
  source_type: string;
  processed: boolean;
  uploaded_at: string;
}

export default function AdminPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number[]>([]);

  const fetchDocs = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/documents/');
      const data = await res.json();
      setDocuments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const ingestDoc = async (id: number) => {
    setProcessing(prev => [...prev, id]);
    try {
      await fetch(`http://localhost:8000/api/documents/${id}/ingest/`, { method: 'POST' });
      await fetchDocs();
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(prev => prev.filter(x => x !== id));
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '3rem auto', padding: '1rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem', borderRadius: '12px' }}>
          <Database className="text-blue-600" size={32} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>Document Management</h1>
          <p style={{ color: '#64748b' }}>Upload and index product documentation for the AI Assistant.</p>
        </div>
        <button 
          onClick={() => fetchDocs()}
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Loading documents...</div>
        ) : documents.map((doc) => (
          <div key={doc.id} style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              borderRadius: '12px',
              transition: 'all 0.2s'
            }}
            className="premium-hover"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ color: '#64748b' }}>
                <FileText size={24} />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, color: '#1e293b' }}>{doc.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Source: {doc.source_type.toUpperCase()}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {doc.processed ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#166534', backgroundColor: '#dcfce7', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                    <CheckCircle2 size={14} /> Ready
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#854d0e', backgroundColor: '#fef9c3', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                    <AlertCircle size={14} /> Pending
                  </span>
                )}
              </div>

              <button 
                onClick={() => ingestDoc(doc.id)}
                disabled={processing.includes(doc.id)}
                style={{
                  backgroundColor: doc.processed ? '#f1f5f9' : '#3b82f6',
                  color: doc.processed ? '#64748b' : 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: processing.includes(doc.id) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 500
                }}
              >
                {processing.includes(doc.id) ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Play size={16} />
                )}
                {doc.processed ? 'Re-index' : 'Ingest'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
