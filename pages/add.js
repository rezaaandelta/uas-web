// File: pages/add.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../components/Header';

export default function AddPage() {
  const router = useRouter();
  const [tmdbId, setTmdbId] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handlePreview = async () => {
    if (!tmdbId.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/tmdb?id=${tmdbId}`);
      const data = await res.json();
      
      if (res.ok) {
        setPreview(data);
      } else {
        setError('Film tidak ditemukan. Pastikan TMDB ID valid.');
        setPreview(null);
      }
    } catch (error) {
      setError('Terjadi kesalahan saat mengambil data film.');
      setPreview(null);
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preview) {
      await handlePreview();
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmdb_id: tmdbId }),
      });

      if (res.ok) {
        router.push('/?added=true');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Gagal menambahkan film');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat menambahkan film');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header onSearch={() => {}} />
      
      <main className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>
              Tambah Film Baru
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
              Masukkan TMDB ID untuk menambahkan film ke koleksi Anda
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '32px'
          }}>
            <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  TMDB ID
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={tmdbId}
                    onChange={(e) => setTmdbId(e.target.value)}
                    placeholder="Contoh: 603 (The Matrix)"
                    style={{
                      flex: '1',
                      padding: '12px 16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'Black',
                      fontSize: '16px'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={handlePreview}
                    disabled={loading || !tmdbId.trim()}
                    className="btn btn-secondary"
                  >
                    {loading ? '⏳' : '👁️'} Preview
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  background: 'rgba(255, 107, 107, 0.1)',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#ff6b6b',
                  marginBottom: '20px'
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link href="/" className="btn btn-secondary">
                  ← Kembali
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? '⏳ Memproses...' : preview ? '💾 Tambahkan Film' : '🔍 Cari Film'}
                </button>
              </div>
            </form>
          </div>

          {preview && (
            <div className="fade-in" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Preview Film</h3>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <img
                  src={`https://image.tmdb.org/t/p/w300${preview.poster_path}`}
                  alt={preview.title}
                  style={{
                    width: '200px',
                    borderRadius: '12px',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: '1' }}>
                  <h2 style={{ marginBottom: '12px' }}>{preview.title}</h2>
                  <p style={{ color: 'rgba(0, 0, 0, 0.7)', marginBottom: '8px' }}>
                    📅 {new Date(preview.release_date).getFullYear()}
                  </p>
                  <p style={{ color: 'rgba(0, 0, 0, 0.7)', marginBottom: '12px' }}>
                    ⭐ {preview.vote_average}/10
                  </p>
                  <p style={{ lineHeight: '1.6', color: 'rgba(2, 2, 2, 0.8)' }}>
                    {preview.overview}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}