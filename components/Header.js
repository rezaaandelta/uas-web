import Link from 'next/link';
import { useState } from 'react';

export default function Header({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <header style={{
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(10px)',
      padding: '20px 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="container">
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <Link href="/" style={{
            fontSize: '28px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg,rgb(221, 255, 29) 0%,rgb(237, 255, 158) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none'
          }}>
            🎬 MovieFlix
          </Link>

          <form onSubmit={handleSearch} style={{
            display: 'flex',
            gap: '10px',
            flex: '1',
            maxWidth: '400px'
          }}>
            <input
              type="text"
              placeholder="Cari film..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: '1',
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px'
              }}
            />
            <button type="submit" className="btn btn-primary">
              🔍 Cari
            </button>
          </form>

<Link href="/add" style={{
  fontSize: '14px',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg,rgb(221, 255, 29) 0%,rgb(237, 255, 158) 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textDecoration: 'none'
}}>
  ➕ Tambah Film
</Link>

        </nav>
      </div>
    </header>
  );
}
