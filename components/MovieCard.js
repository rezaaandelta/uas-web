import Link from 'next/link';
import { useState } from 'react';

export default function MovieCard({ movie, onDelete }) {
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus film ini?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/movies/${movie.id}`, { method: 'DELETE' });
      if (res.ok) {
        onDelete(movie.id);
      } else {
        alert('Gagal menghapus film');
      }
    } catch (error) {
      alert('Terjadi kesalahan');
    }
    setIsDeleting(false);
  };

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg';

  return (
    <div className="fade-in" style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div style={{ position: 'relative', paddingBottom: '150%' }}>
        {!imageError ? (
          <img
            src={posterUrl}
            alt={movie.title}
            onError={() => setImageError(true)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px'
          }}>
            🎬
          </div>
        )}
        
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          ⭐ {movie.rating ? parseFloat(movie.rating).toFixed(1) : 'N/A'}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '8px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {movie.title}
        </h3>

        <p style={{
          color: 'rgba(0, 0, 0, 0.7)',
          fontSize: '14px',
          marginBottom: '16px'
        }}>
          📅 {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
        </p>

        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <Link href={`/edit/${movie.id}`} className="btn btn-secondary" style={{ flex: '1', minWidth: '80px', justifyContent: 'center' }}>
            ✏️ Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn btn-danger"
            style={{ flex: '1', minWidth: '80px', justifyContent: 'center' }}
          >
            {isDeleting ? '⏳' : '🗑️'} Hapus
          </button>
        </div>
      </div>
    </div>
  );
}