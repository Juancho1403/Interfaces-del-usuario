const db = require('../config/db');

class Video {
  static async find() {
    try {
      const [rows] = await db.execute('SELECT * FROM videos ORDER BY createdAt DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM videos WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async save(videoData) {
    try {
      const { name, format, duration, size, file, audioTracks, subtitles } = videoData;
      
      // Insertar el video principal
      const [result] = await db.execute(
        'INSERT INTO videos (name, format, duration, size, file, audioTracks, subtitles, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [name, format, duration, size, file, JSON.stringify(audioTracks), JSON.stringify(subtitles)]
      );
      
      return { id: result.insertId, ...videoData };
    } catch (error) {
      throw error;
    }
  }

  static async findByIdAndUpdate(id, updateData, options = {}) {
    try {
      const { name, format, duration, size, file, audioTracks, subtitles } = updateData;
      
      const [result] = await db.execute(
        'UPDATE videos SET name = ?, format = ?, duration = ?, size = ?, file = ?, audioTracks = ?, subtitles = ? WHERE id = ?',
        [name, format, duration, size, file, JSON.stringify(audioTracks), JSON.stringify(subtitles), id]
      );
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return { id, ...updateData };
    } catch (error) {
      throw error;
    }
  }

  static async findByIdAndDelete(id) {
    try {
      const [result] = await db.execute('DELETE FROM videos WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Video;