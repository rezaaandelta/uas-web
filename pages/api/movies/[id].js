// File: pages/api/movies/[id].js
import db from '../../../lib/db';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  // Validate ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'ID tidak valid' });
  }

  if (method === 'GET') {
    try {
      const [rows] = await db.query('SELECT * FROM movies WHERE id = ?', [id]);
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).json({ message: 'Film tidak ditemukan' });
      }
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Gagal mengambil data film' });
    }
  }

  else if (method === 'PUT') {
    const { title, poster_path, release_date, rating } = req.body;

    // Validation
    if (!title?.trim()) {
      return res.status(400).json({ message: 'Judul harus diisi' });
    }

    if (!release_date) {
      return res.status(400).json({ message: 'Tanggal rilis harus diisi' });
    }

    if (rating && (isNaN(rating) || rating < 0 || rating > 10)) {
      return res.status(400).json({ message: 'Rating harus berupa angka antara 0-10' });
    }

    try {
      const [result] = await db.query(
        'UPDATE movies SET title = ?, poster_path = ?, release_date = ?, rating = ?, updated_at = NOW() WHERE id = ?',
        [title.trim(), poster_path || null, release_date, rating || null, id]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Film tidak ditemukan' });
      } else {
        res.status(200).json({ message: 'Film berhasil diperbarui' });
      }
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Gagal memperbarui film' });
    }
  }

  else if (method === 'DELETE') {
    try {
      const [result] = await db.query('DELETE FROM movies WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Film tidak ditemukan' });
      } else {
        res.status(200).json({ message: 'Film berhasil dihapus' });
      }
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Gagal menghapus film' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ message: 'Method tidak diizinkan' });
  }
}