CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  poster_path VARCHAR(500),
  release_date DATE,
  rating DECIMAL(3,1),
  tmdb_id INT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tmdb_id (tmdb_id),
  INDEX idx_created_at (created_at),
  INDEX idx_title (title)
);
