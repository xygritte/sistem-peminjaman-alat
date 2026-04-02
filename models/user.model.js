const db = require('./db');

module.exports = {
    usernameExists: async (username) => {
        const [rows] = await db.query('SELECT id_user FROM users WHERE username = ?', [username]);
        return rows.length > 0;
    },
    
    findByUsername: async (username) => {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    },
    
    findById: async (id) => {
        const [rows] = await db.query('SELECT id_user, nama, username, role FROM users WHERE id_user = ?', [id]);
        return rows[0];
    },
    
    getAll: async () => {
        const [rows] = await db.query('SELECT id_user, nama, username, role, created_at FROM users');
        return rows;
    },
    
    create: async (data) => {
        const { nama, username, password_hash, role } = data;
        const [result] = await db.query(
            'INSERT INTO users (nama, username, password_hash, role) VALUES (?, ?, ?, ?)',
            [nama, username, password_hash, role || 'peminjam']
        );
        return result.insertId;
    },
    
    update: async (id, data) => {
        const { nama, username, role } = data;
        await db.query('UPDATE users SET nama = ?, username = ?, role = ? WHERE id_user = ?', [nama, username, role, id]);
    },
    
    delete: async (id) => {
        await db.query('DELETE FROM users WHERE id_user = ?', [id]);
    }
};