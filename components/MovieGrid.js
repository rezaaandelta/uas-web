import MovieCard from './MovieCard';

export default function MovieGrid({ movies, onDelete, loading }) {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎬</div>
        <h2 style={{ marginBottom: '10px' }}>Belum ada film</h2>
        <p>Tambahkan film pertama Anda dengan mengklik tombol "Tambah Film"</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px',
      padding: '20px 0'
    }}>
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
