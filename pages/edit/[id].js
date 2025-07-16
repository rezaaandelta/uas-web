// File: pages/edit/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../components/Header';
import MovieForm from '../../components/MovieForm';

export default function EditPage() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie]= useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const res = await fetch(`/api/movies/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMovie(data);
      } else {
        setError('Film tidak ditemukan');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat mengambil data film');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        router.push('/?updated=true');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Gagal memperbarui film');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat memperbarui film');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Header onSearch={() => {}} />
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error && !movie) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Header onSearch={() => {}} />
        <main className="container" style={{ paddingTop: '40px', textAlign: 'center' }}>
          <div style={{ color: '#ff6b6b', fontSize: '18px', marginBottom: '20px' }}>
            {error}
          </div>
          <Link href="/" className="btn btn-primary">
            ← Kembali ke Beranda
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header onSearch={() => {}} />
      
      <main className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>
              Edit Film
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
              Perbarui informasi film "{movie?.title}"
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              color: '#ff6b6b',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <MovieForm 
            movieData={movie} 
            onSubmit={handleUpdate}
            loading={saving}
          />

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/" className="btn btn-secondary">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}