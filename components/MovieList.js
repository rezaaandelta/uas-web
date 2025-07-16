import Link from 'next/link';

export default function MovieList({ movies }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '24px',
      paddingTop: '20px'
    }}>
      {movies.map(movie => (
        <div
          key={movie.id}
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}
        >
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#111'
          }}>
            {movie.title}
          </h2>

            <a
              href={`https://www.themoviedb.org/movie/${movie.tmdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Lihat di TMDB"
              style={{ display: 'block', position: 'relative', zIndex: 1 }}
            >
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              style={{
                width: '100%',
                borderRadius: '8px',
                marginBottom: '10px',
                cursor: 'pointer'
              }}
            />
          </a>

          <p><strong>Rilis:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.rating}</p>

          <div style={{
            marginTop: '10px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center'
          }}>
            <Link href={`/edit/${movie.id}`}>
              <button className="btn btn-secondary">Edit</button>
            </Link>

            <button
              className="btn btn-danger"
              onClick={async () => {
                const ok = confirm('Yakin ingin menghapus film ini?');
                if (ok) {
                  const res = await fetch(`/api/movies/${movie.id}`, { method: 'DELETE' });
                  if (res.ok) location.reload();
                }
              }}
            >
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
