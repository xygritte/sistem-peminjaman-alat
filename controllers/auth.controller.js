const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const logModel = require('../models/log.model');

module.exports = {
    getLogin: (req, res) => {
        res.render('auth/login', { title: 'Login', error: null, success: null });
    },
    
    postLogin: async (req, res) => {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.render('auth/login', { 
                    title: 'Login', 
                    error: 'Username dan password wajib diisi',
                    success: null
                });
            }
            
            const user = await userModel.findByUsername(username);
            
            if (!user) {
                return res.render('auth/login', { 
                    title: 'Login', 
                    error: 'Username tidak ditemukan',
                    success: null
                });
            }
            
            const match = await bcrypt.compare(password, user.password_hash);
            
            if (!match) {
                return res.render('auth/login', { 
                    title: 'Login', 
                    error: 'Password salah',
                    success: null
                });
            }
            
            req.session.user = {
                id: user.id_user,
                nama: user.nama,
                username: user.username,
                role: user.role
            };
            
            await logModel.create(user.id_user, `Login sebagai ${user.role}`);
            
            if (user.role === 'admin') return res.redirect('/admin/dashboard');
            if (user.role === 'petugas') return res.redirect('/petugas/dashboard');
            if (user.role === 'peminjam') return res.redirect('/peminjam/dashboard');
            
            res.redirect('/login');
            
        } catch (error) {
            console.error('Login error:', error);
            res.render('auth/login', { 
                title: 'Login', 
                error: 'Terjadi kesalahan sistem',
                success: null
            });
        }
    },
    
    getRegister: (req, res) => {
        res.render('auth/register', { title: 'Daftar Akun', error: null, formData: {} });
    },
    
    postRegister: async (req, res) => {
        try {
            const { nama, username, password, confirm_password } = req.body;
            
            if (!nama || !username || !password || !confirm_password) {
                return res.render('auth/register', {
                    title: 'Daftar Akun',
                    error: 'Semua field wajib diisi',
                    formData: { nama, username }
                });
            }
            
            if (nama.length < 3) {
                return res.render('auth/register', {
                    title: 'Daftar Akun',
                    error: 'Nama minimal 3 karakter',
                    formData: { nama, username }
                });
            }
            
            if (username.length < 4) {
                return res.render('auth/register', {
                    title: 'Daftar Akun',
                    error: 'Username minimal 4 karakter',
                    formData: { nama, username }
                });
            }
            
            if (password.length < 6) {
                return res.render('auth/register', {
                    title: 'Daftar Akun',
                    error: 'Password minimal 6 karakter',
                    formData: { nama, username }
                });
            }
            
            if (password !== confirm_password) {
                return res.render('auth/register', {
                    title: 'Daftar Akun',
                    error: 'Konfirmasi password tidak cocok',
                    formData: { nama, username }
                });
            }
            
            const exists = await userModel.usernameExists(username);
            if (exists) {
                return res.render('auth/register', {
                    title: 'Daftar Akun',
                    error: 'Username sudah digunakan, silakan pilih username lain',
                    formData: { nama, username }
                });
            }
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            const userId = await userModel.create({
                nama: nama,
                username: username,
                password_hash: hashedPassword,
                role: 'peminjam'
            });
            
            await logModel.create(userId, 'Registrasi akun baru');
            
            res.render('auth/login', {
                title: 'Login',
                error: null,
                success: 'Pendaftaran berhasil! Silakan login dengan akun Anda.'
            });
            
        } catch (error) {
            console.error('Register error:', error);
            res.render('auth/register', {
                title: 'Daftar Akun',
                error: 'Terjadi kesalahan sistem. Silakan coba lagi.',
                formData: req.body
            });
        }
    },
    
    logout: async (req, res) => {
        if (req.session.user) {
            await logModel.create(req.session.user.id, 'Logout');
        }
        req.session.destroy();
        res.redirect('/login');
    }
};