"use client";
import { useEffect, useState } from 'react';
import { Database, FileText, CheckCircle2, AlertCircle, Play, RefreshCw, Upload, Search, Filter, MoreVertical, LayoutGrid, List, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDocs = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/documents/');
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
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

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', backgroundColor: '#0f172a', color: 'white', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem' }}>
          <div style={{ backgroundColor: '#2563eb', padding: '0.5rem', borderRadius: '10px' }}>
            <Database size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>MEMOX.<span style={{ color: '#3b82f6' }}>AI</span></h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '0.75rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
            <FileText size={20} /> Documents
          </div>
          <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.5, cursor: 'not-allowed' }}>
            <LayoutGrid size={20} /> Dashboard
          </div>
          <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.5, cursor: 'not-allowed' }}>
            <User size={20} /> Leads
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Knowledge Base</h1>
            <p style={{ color: '#64748b' }}>Manage the documents used to train your sales assistant.</p>
          </div>
          <button style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)' }}>
            <Upload size={18} /> Upload Document
          </button>
        </header>

        {/* Filters/Search */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem', display: 'flex', gap: '1rem', marginBottom: '2rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documents..." 
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '10px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', outline: 'none' }}
            />
          </div>
          <button style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Filter size={18} /> Filter
          </button>
        </div>

        {/* Table/List */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '1.25rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>DOCUMENT NAME</th>
                <th style={{ textAlign: 'left', padding: '1.25rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>TYPE</th>
                <th style={{ textAlign: 'left', padding: '1.25rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>STATUS</th>
                <th style={{ textAlign: 'left', padding: '1.25rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>UPLOADED</th>
                <th style={{ textAlign: 'right', padding: '1.25rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading index...</td>
                </tr>
              ) : filteredDocs.map((doc, i) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', backgroundColor: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                        <FileText size={18} />
                      </div>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{doc.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                      {doc.source_type}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    {doc.processed ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#166534', backgroundColor: '#dcfce7', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <CheckCircle2 size={14} /> ACTIVE
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#854d0e', backgroundColor: '#fef9c3', padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <RefreshCw size={14} className="animate-spin" /> PENDING
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem', color: '#64748b', fontSize: '0.875rem' }}>
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => ingestDoc(doc.id)}
                      disabled={processing.includes(doc.id)}
                      style={{
                        backgroundColor: doc.processed ? 'transparent' : '#f8fafc',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}
                    >
                      {processing.includes(doc.id) ? "Syncing..." : "Sync"}
                    </button>
                    <button style={{ marginLeft: '0.75rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDocs.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '5rem' }}>
              <div style={{ color: '#cbd5e1', marginBottom: '1rem' }}><Database size={48} style={{ margin: '0 auto' }} /></div>
              <p style={{ color: '#64748b' }}>No documents found matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
