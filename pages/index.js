// File: pages/index.js
import MovieList from '../components/MovieList';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    sortMovies();
  }, [movies, sortBy]);

  const fetchMovies = async () => {
    try {
      const res = await fetch('/api/movies');
      const data = await res.json();
      setMovies(data);
      setFilteredMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredMovies(movies);
      return;
    }

    const filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  const sortMovies = () => {
    const sorted = [...filteredMovies].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.release_date) - new Date(a.release_date);
        case 'oldest':
          return new Date(a.release_date) - new Date(b.release_date);
        case 'rating':
          return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    setFilteredMovies(sorted);
  };

  const handleDelete = (movieId) => {
    const updatedMovies = movies.filter(movie => movie.id !== movieId);
    setMovies(updatedMovies);
    setFilteredMovies(updatedMovies.filter(movie => 
      filteredMovies.some(fm => fm.id === movie.id)
    ));
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header onSearch={handleSearch} />
      
      <main className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
              Koleksi Film
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {filteredMovies.length} film tersedia
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Urutkan:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px'
              }}
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="title">Judul A-Z</option>
            </select>
          </div>
        </div>

        <MovieGrid
          movies={filteredMovies}
          onDelete={handleDelete}
          loading={loading}
        />
      </main>
    </div>
  );
}






