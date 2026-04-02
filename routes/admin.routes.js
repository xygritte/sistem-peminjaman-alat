const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

router.use(isAuthenticated, isAdmin);

router.get('/dashboard', adminController.dashboard);
router.get('/users', adminController.getUsers);
router.get('/users/add', adminController.createUserForm);
router.post('/users/add', adminController.createUser);
router.get('/users/edit/:id', adminController.editUserForm);
router.post('/users/edit/:id', adminController.editUser);
router.get('/users/delete/:id', adminController.deleteUser);

router.get('/alat', adminController.getAlat);
router.get('/alat/add', adminController.createAlatForm);
router.post('/alat/add', adminController.createAlat);
router.get('/alat/edit/:id', adminController.editAlatForm);
router.post('/alat/edit/:id', adminController.editAlat);
router.get('/alat/delete/:id', adminController.deleteAlat);

router.get('/peminjaman', adminController.getPeminjaman);
router.get('/pengembalian', adminController.getPengembalian);
router.get('/logs', adminController.getLogs);

module.exports = router;