const userModel = require('../models/user.model');
const alatModel = require('../models/alat.model');
const peminjamanModel = require('../models/peminjaman.model');
const pengembalianModel = require('../models/pengembalian.model');
const logModel = require('../models/log.model');
const bcrypt = require('bcrypt');

module.exports = {
    dashboard: async (req, res) => {
        const users = await userModel.getAll();
        const alat = await alatModel.getAll();
        const peminjaman = await peminjamanModel.getAll();
        
        // Mengirimkan panjang array untuk statistik di dashboard
        res.render('admin/dashboard', { 
            title: 'Dashboard Admin', 
            user: req.session.user, 
            totalUser: users.length, 
            totalAlat: alat.length, 
            totalPeminjaman: peminjaman.length 
        });
    },
    
    getUsers: async (req, res) => {
        const users = await userModel.getAll();
        res.render('admin/users', { title: 'Manajemen User', user: req.session.user, users });
    },
    
    createUserForm: (req, res) => {
        // PERBAIKAN: ubah user_form menjadi user-form
        res.render('admin/user-form', { title: 'Tambah User', user: req.session.user, userData: null, error: null });
    },
    
    createUser: async (req, res) => {
        const { nama, username, password, role } = req.body;
        const existing = await userModel.findByUsername(username);
        if (existing) {
            // PERBAIKAN: ubah user_form menjadi user-form
            return res.render('admin/user-form', { title: 'Tambah User', user: req.session.user, userData: req.body, error: 'Username sudah digunakan' });
        }
        const hashed = await bcrypt.hash(password, 10);
        await userModel.create({ nama, username, password_hash: hashed, role });
        await logModel.create(req.session.user.id, `Menambah user ${username}`);
        res.redirect('/admin/users');
    },
    
    editUserForm: async (req, res) => {
        const user = await userModel.findById(req.params.id);
        if (!user) return res.redirect('/admin/users');
        // PERBAIKAN: ubah user_form menjadi user-form
        res.render('admin/user-form', { title: 'Edit User', user: req.session.user, userData: user, error: null });
    },
    
    editUser: async (req, res) => {
        const { nama, username, role } = req.body;
        await userModel.update(req.params.id, { nama, username, role });
        await logModel.create(req.session.user.id, `Mengedit user ID ${req.params.id}`);
        res.redirect('/admin/users');
    },
    
    deleteUser: async (req, res) => {
        await userModel.delete(req.params.id);
        await logModel.create(req.session.user.id, `Menghapus user ID ${req.params.id}`);
        res.redirect('/admin/users');
    },
    
    getAlat: async (req, res) => {
        const alat = await alatModel.getAll();
        res.render('admin/alat', { title: 'Data Alat', user: req.session.user, alat });
    },
    
    createAlatForm: (req, res) => {
        // PERBAIKAN: ubah alat_form menjadi alat-form
        res.render('admin/alat-form', { title: 'Tambah Alat', user: req.session.user, alatData: null, error: null });
    },
    
    createAlat: async (req, res) => {
        const { nama_alat, kategori, jumlah_total, jumlah_tersedia, kondisi, lokasi } = req.body;
        await alatModel.create({ nama_alat, kategori, jumlah_total: parseInt(jumlah_total), jumlah_tersedia: parseInt(jumlah_tersedia), kondisi, lokasi });
        await logModel.create(req.session.user.id, `Menambah alat ${nama_alat}`);
        res.redirect('/admin/alat');
    },
    
    editAlatForm: async (req, res) => {
        const alat = await alatModel.getById(req.params.id);
        if (!alat) return res.redirect('/admin/alat');
        // PERBAIKAN: ubah alat_form menjadi alat-form
        res.render('admin/alat-form', { title: 'Edit Alat', user: req.session.user, alatData: alat, error: null });
    },
    
    editAlat: async (req, res) => {
        const { nama_alat, kategori, jumlah_total, jumlah_tersedia, kondisi, lokasi } = req.body;
        await alatModel.update(req.params.id, { nama_alat, kategori, jumlah_total: parseInt(jumlah_total), jumlah_tersedia: parseInt(jumlah_tersedia), kondisi, lokasi });
        await logModel.create(req.session.user.id, `Mengedit alat ID ${req.params.id}`);
        res.redirect('/admin/alat');
    },
    
    deleteAlat: async (req, res) => {
        await alatModel.delete(req.params.id);
        await logModel.create(req.session.user.id, `Menghapus alat ID ${req.params.id}`);
        res.redirect('/admin/alat');
    },
    

    getPeminjaman: async (req, res) => {
        const peminjaman = await peminjamanModel.getAll();
        res.render('admin/peminjaman', { 
            title: 'Data Peminjaman', 
            user: req.session.user, 
            peminjaman 
        });
    },

    getPengembalian: async (req, res) => {
        const pengembalian = await pengembalianModel.getAll();
        // Untuk pengembalian, kita juga perlu detail alat
        for (const item of pengembalian) {
            const peminjaman = await peminjamanModel.getById(item.id_peminjaman);
            item.details = peminjaman ? peminjaman.details : [];
            item.peminjam_nama = peminjaman ? peminjaman.peminjam_nama : '-';
        }
        res.render('admin/pengembalian', { 
            title: 'Data Pengembalian', 
            user: req.session.user, 
            pengembalian 
        });
    },

    
    getLogs: async (req, res) => {
        const logs = await logModel.getAll();
        res.render('admin/logs', { title: 'Log Aktivitas', user: req.session.user, logs });
    }
};