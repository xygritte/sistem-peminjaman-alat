const express = require('express');
const session = require('express-session');
const path = require('path');
const expressLayouts = require('express-ejs-layouts'); // 👈 1. Import library ini
require('dotenv').config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 3600000 }
}));

// 👈 2. Tambahkan Konfigurasi Layout di sini
app.use(expressLayouts);
app.set('layout', 'layouts/layout'); // Mengarahkan ke views/layouts/layout.ejs

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const petugasRoutes = require('./routes/petugas.routes');
const peminjamRoutes = require('./routes/peminjam.routes');

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/petugas', petugasRoutes);
app.use('/peminjam', peminjamRoutes);

// Root route
app.get('/', (req, res) => {
    if (req.session.user) {
        const role = req.session.user.role;
        if (role === 'admin') return res.redirect('/admin/dashboard');
        if (role === 'petugas') return res.redirect('/petugas/dashboard');
        if (role === 'peminjam') return res.redirect('/peminjam/dashboard');
    }
    res.redirect('/login');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Halaman Tidak Ditemukan</h1>
        <p>Maaf, halaman yang Anda cari tidak tersedia.</p>
        <a href="/login">Kembali ke Login</a>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
    console.log(`🔐 Login: http://localhost:${PORT}/login`);
    console.log(`📝 Register: http://localhost:${PORT}/register`);
});