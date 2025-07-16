import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID diperlukan' });
  }

  if (!process.env.TMDB_API_KEY) {
    return res.status(500).json({ error: 'TMDB API key tidak dikonfigurasi' });
  }

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'id-ID' // Indonesian language
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('TMDB API error:', error);
    
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Film tidak ditemukan di TMDB' });
    } else if (error.response?.status === 401) {
      res.status(401).json({ error: 'TMDB API key tidak valid' });
    } else {
      res.status(500).json({ error: 'Gagal mengambil data dari TMDB' });
    }
  }
}
