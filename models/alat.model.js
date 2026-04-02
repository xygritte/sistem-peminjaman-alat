const db = require('./db');

module.exports = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM alat ORDER BY id_alat DESC');
        return rows;
    },
    
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM alat WHERE id_alat = ?', [id]);
        return rows[0];
    },
    
    create: async (data) => {
        const { nama_alat, kategori, jumlah_total, jumlah_tersedia, kondisi, lokasi } = data;
        const [result] = await db.query(
            'INSERT INTO alat (nama_alat, kategori, jumlah_total, jumlah_tersedia, kondisi, lokasi) VALUES (?, ?, ?, ?, ?, ?)',
            [nama_alat, kategori, jumlah_total, jumlah_tersedia, kondisi, lokasi]
        );
        return result.insertId;
    },
    
    update: async (id, data) => {
        const { nama_alat, kategori, jumlah_total, jumlah_tersedia, kondisi, lokasi } = data;
        await db.query(
            'UPDATE alat SET nama_alat = ?, kategori = ?, jumlah_total = ?, jumlah_tersedia = ?, kondisi = ?, lokasi = ? WHERE id_alat = ?',
            [nama_alat, kategori, jumlah_total, jumlah_tersedia, kondisi, lokasi, id]
        );
    },
    
    delete: async (id) => {
        await db.query('DELETE FROM alat WHERE id_alat = ?', [id]);
    },
    
    kurangiStok: async (id_alat, jumlah) => {
        await db.query('UPDATE alat SET jumlah_tersedia = jumlah_tersedia - ? WHERE id_alat = ?', [jumlah, id_alat]);
    },
    
    tambahStok: async (id_alat, jumlah) => {
        await db.query('UPDATE alat SET jumlah_tersedia = jumlah_tersedia + ? WHERE id_alat = ?', [jumlah, id_alat]);
    }
};