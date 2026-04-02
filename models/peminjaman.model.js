const db = require('./db');
const detailModel = require('./detailPeminjaman.model');

module.exports = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT p.*, u.nama as peminjam_nama 
            FROM peminjaman p 
            JOIN users u ON p.id_user = u.id_user 
            ORDER BY p.tanggal_pinjam DESC
        `);
        
        // Ambil detail alat untuk setiap peminjaman
        if (rows.length > 0) {
            const peminjamanIds = rows.map(p => p.id_peminjaman);
            const details = await detailModel.getByMultiplePeminjamanIds(peminjamanIds);
            
            // Group detail berdasarkan id_peminjaman
            const detailsMap = {};
            details.forEach(d => {
                if (!detailsMap[d.id_peminjaman]) detailsMap[d.id_peminjaman] = [];
                detailsMap[d.id_peminjaman].push(d);
            });
            
            // Tambahkan detail ke setiap peminjaman
            rows.forEach(p => {
                p.details = detailsMap[p.id_peminjaman] || [];
            });
        }
        
        return rows;
    },
    
    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT p.*, u.nama as peminjam_nama 
            FROM peminjaman p 
            JOIN users u ON p.id_user = u.id_user 
            WHERE p.id_peminjaman = ?
        `, [id]);
        
        if (rows[0]) {
            const details = await detailModel.getByPeminjamanId(id);
            rows[0].details = details;
        }
        
        return rows[0];
    },
    
    getByUserId: async (userId) => {
        const [rows] = await db.query(`
            SELECT p.*, 
                (SELECT SUM(jumlah) FROM detail_peminjaman WHERE id_peminjaman = p.id_peminjaman) as total_alat
            FROM peminjaman p 
            WHERE p.id_user = ? 
            ORDER BY p.tanggal_pinjam DESC
        `, [userId]);
        
        // Ambil detail alat untuk setiap peminjaman
        if (rows.length > 0) {
            const peminjamanIds = rows.map(p => p.id_peminjaman);
            const details = await detailModel.getByMultiplePeminjamanIds(peminjamanIds);
            
            const detailsMap = {};
            details.forEach(d => {
                if (!detailsMap[d.id_peminjaman]) detailsMap[d.id_peminjaman] = [];
                detailsMap[d.id_peminjaman].push(d);
            });
            
            rows.forEach(p => {
                p.details = detailsMap[p.id_peminjaman] || [];
            });
        }
        
        return rows;
    },
    
    getMenunggu: async () => {
        const [rows] = await db.query(`
            SELECT p.*, u.nama as peminjam_nama 
            FROM peminjaman p 
            JOIN users u ON p.id_user = u.id_user 
            WHERE p.status = 'menunggu'
            ORDER BY p.tanggal_pinjam ASC
        `, []);
        
        if (rows.length > 0) {
            const peminjamanIds = rows.map(p => p.id_peminjaman);
            const details = await detailModel.getByMultiplePeminjamanIds(peminjamanIds);
            
            const detailsMap = {};
            details.forEach(d => {
                if (!detailsMap[d.id_peminjaman]) detailsMap[d.id_peminjaman] = [];
                detailsMap[d.id_peminjaman].push(d);
            });
            
            rows.forEach(p => {
                p.details = detailsMap[p.id_peminjaman] || [];
            });
        }
        
        return rows;
    },
    
    create: async (data) => {
        const { id_user, tanggal_pinjam, tanggal_rencana_kembali, status } = data;
        const [result] = await db.query(
            'INSERT INTO peminjaman (id_user, tanggal_pinjam, tanggal_rencana_kembali, status) VALUES (?, ?, ?, ?)',
            [id_user, tanggal_pinjam, tanggal_rencana_kembali, status || 'menunggu']
        );
        return result.insertId;
    },
    
    updateStatus: async (id, status) => {
        await db.query('UPDATE peminjaman SET status = ? WHERE id_peminjaman = ?', [status, id]);
    }
};