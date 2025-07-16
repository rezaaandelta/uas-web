// File: pages/api/movies/index.js
import db from '../../../lib/db';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [movies] = await db.query('SELECT * FROM movies ORDER BY created_at DESC');
      res.status(200).json(movies);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Gagal mengambil data film' });
    }
  } 
  
  else if (req.method === 'POST') {
    const { tmdb_id } = req.body;

    if (!tmdb_id) {
      return res.status(400).json({ message: 'TMDB ID diperlukan' });
    }

    try {
      // Check if movie already exists
      const [existing] = await db.query('SELECT id FROM movies WHERE tmdb_id = ?', [tmdb_id]);
      if (existing.length > 0) {
        return res.status(409).json({ message: 'Film sudah ada dalam database' });
      }

      // Fetch from TMDB
      const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdb_id}?api_key=${process.env.TMDB_API_KEY}`);
      const movie = tmdbRes.data;

      // Insert to database
      const [result] = await db.query(
        'INSERT INTO movies (title, poster_path, release_date, rating, tmdb_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [movie.title, movie.poster_path, movie.release_date, movie.vote_average, movie.id]
      );

      res.status(201).json({ 
        id: result.insertId, 
        message: 'Film berhasil ditambahkan',
        movie: {
          id: result.insertId,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          rating: movie.vote_average,
          tmdb_id: movie.id
        }
      });
    } catch (error) {
      console.error('Error adding movie:', error);
      
      if (error.response?.status === 404) {
        res.status(404).json({ message: 'Film tidak ditemukan di TMDB' });
      } else {
        res.status(500).json({ message: 'Gagal menambahkan film' });
      }
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: 'Method tidak diizinkan' });
  }
}