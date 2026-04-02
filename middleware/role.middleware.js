module.exports = {
    isAdmin: (req, res, next) => {
        if (req.session.user && req.session.user.role === 'admin') {
            return next();
        }
        res.status(403).send(`
            <h1>Akses Ditolak</h1>
            <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
            <a href="/login">Kembali ke Login</a>
        `);
    },
    
    isPetugas: (req, res, next) => {
        if (req.session.user && (req.session.user.role === 'petugas' || req.session.user.role === 'admin')) {
            return next();
        }
        res.status(403).send(`
            <h1>Akses Ditolak</h1>
            <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
            <a href="/login">Kembali ke Login</a>
        `);
    },
    
    isPeminjam: (req, res, next) => {
        if (req.session.user && req.session.user.role === 'peminjam') {
            return next();
        }
        res.status(403).send(`
            <h1>Akses Ditolak</h1>
            <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
            <a href="/login">Kembali ke Login</a>
        `);
    }
};