const express = require('express');
const router = express.Router();
const petugasController = require('../controllers/petugas.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { isPetugas } = require('../middleware/role.middleware');

router.use(isAuthenticated, isPetugas);

router.get('/dashboard', petugasController.dashboard);
router.get('/alat', petugasController.getAlat);
router.get('/kelolaPeminjaman', petugasController.kelolaPeminjaman);
router.get('/approve/:id', petugasController.approve);
router.get('/pengembalian/:id', petugasController.formPengembalian);
router.post('/pengembalian/:id', petugasController.prosesPengembalian);

module.exports = router;