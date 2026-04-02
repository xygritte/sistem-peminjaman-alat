const express = require('express');
const router = express.Router();
const peminjamController = require('../controllers/peminjam.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { isPeminjam } = require('../middleware/role.middleware');

router.use(isAuthenticated, isPeminjam);

router.get('/dashboard', peminjamController.dashboard);
router.get('/alat', peminjamController.daftarAlat);
router.get('/pinjam', peminjamController.ajukanPeminjamanForm);
router.post('/pinjam', peminjamController.ajukanPeminjaman);
router.get('/riwayat', peminjamController.riwayat);

module.exports = router;