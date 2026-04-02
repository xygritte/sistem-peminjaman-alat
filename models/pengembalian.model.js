const db = require('./db');

module.exports = {
    create: async (data) => {
        const { id_peminjaman, tanggal_kembali, kondisi, catatan } = data;
        const [result] = await db.query(
            'INSERT INTO pengembalian (id_peminjaman, tanggal_kembali, kondisi, catatan) VALUES (?, ?, ?, ?)',
            [id_peminjaman, tanggal_kembali, kondisi, catatan]
        );
        return result.insertId;
    },
    
    getByPeminjamanId: async (id_peminjaman) => {
        const [rows] = await db.query('SELECT * FROM pengembalian WHERE id_peminjaman = ?', [id_peminjaman]);
        return rows[0];
    },
    
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT p.*, u.nama as peminjam_nama, pj.tanggal_pinjam, pj.tanggal_rencana_kembali
            FROM pengembalian p
            JOIN peminjaman pj ON p.id_peminjaman = pj.id_peminjaman
            JOIN users u ON pj.id_user = u.id_user
            ORDER BY p.tanggal_kembali DESC
        `);
        return rows;
    }
};