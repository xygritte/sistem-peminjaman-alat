const db = require('./db');

module.exports = {
    create: async (id_user, aktivitas) => {
        await db.query('INSERT INTO log_aktivitas (id_user, aktivitas) VALUES (?, ?)', [id_user, aktivitas]);
    },
    
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT l.*, u.nama 
            FROM log_aktivitas l 
            JOIN users u ON l.id_user = u.id_user 
            ORDER BY l.waktu DESC
        `);
        return rows;
    }
};