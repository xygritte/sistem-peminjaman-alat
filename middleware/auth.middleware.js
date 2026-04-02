module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.session.user) {
            return next();
        }
        res.redirect('/login');
    },
    
    isGuest: (req, res, next) => {
        if (req.session.user) {
            const role = req.session.user.role;
            if (role === 'admin') return res.redirect('/admin/dashboard');
            if (role === 'petugas') return res.redirect('/petugas/dashboard');
            if (role === 'peminjam') return res.redirect('/peminjam/dashboard');
        }
        return next();
    }
};