const db = require('./db');

module.exports = {
    create: async (id_peminjaman, id_alat, jumlah) => {
        await db.query(
            'INSERT INTO detail_peminjaman (id_peminjaman, id_alat, jumlah) VALUES (?, ?, ?)',
            [id_peminjaman, id_alat, jumlah]
        );
    },
    
    getByPeminjamanId: async (id_peminjaman) => {
        const [rows] = await db.query(`
            SELECT d.*, a.nama_alat, a.kategori 
            FROM detail_peminjaman d 
            JOIN alat a ON d.id_alat = a.id_alat 
            WHERE d.id_peminjaman = ?
        `, [id_peminjaman]);
        return rows;
    },
    
    // Fungsi baru: mendapatkan semua detail untuk multiple peminjaman
    getByMultiplePeminjamanIds: async (peminjamanIds) => {
        if (!peminjamanIds || peminjamanIds.length === 0) return [];
        const placeholders = peminjamanIds.map(() => '?').join(',');
        const [rows] = await db.query(`
            SELECT d.*, a.nama_alat, a.kategori, d.id_peminjaman
            FROM detail_peminjaman d 
            JOIN alat a ON d.id_alat = a.id_alat 
            WHERE d.id_peminjaman IN (${placeholders})
        `, peminjamanIds);
        return rows;
    },
    
    deleteByPeminjamanId: async (id_peminjaman) => {
        await db.query('DELETE FROM detail_peminjaman WHERE id_peminjaman = ?', [id_peminjaman]);
    }
};