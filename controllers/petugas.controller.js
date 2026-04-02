const alatModel = require('../models/alat.model');
const peminjamanModel = require('../models/peminjaman.model');
const detailPeminjamanModel = require('../models/detailPeminjaman.model');
const pengembalianModel = require('../models/pengembalian.model');
const logModel = require('../models/log.model');

module.exports = {
    dashboard: async (req, res) => {
        const menunggu = await peminjamanModel.getMenunggu();
        const allPeminjaman = await peminjamanModel.getAll();
        const dipinjam = allPeminjaman.filter(p => p.status === 'dipinjam');
        res.render('petugas/dashboard', { 
            title: 'Dashboard Petugas', 
            user: req.session.user, 
            menunggu, 
            dipinjam 
        });
    },
    
    getAlat: async (req, res) => {
        const alat = await alatModel.getAll();
        res.render('petugas/alat', { title: 'Data Alat', user: req.session.user, alat });
    },
    
    kelolaPeminjaman: async (req, res) => {
        const menunggu = await peminjamanModel.getMenunggu();
        const allPeminjaman = await peminjamanModel.getAll();
        const dipinjam = allPeminjaman.filter(p => p.status === 'dipinjam');
        res.render('petugas/kelolaPeminjaman', { 
            title: 'Kelola Peminjaman', 
            user: req.session.user, 
            menunggu, 
            dipinjam 
        });
    },
    
    approve: async (req, res) => {
        const id = req.params.id;
        const peminjaman = await peminjamanModel.getById(id);
        if (!peminjaman || peminjaman.status !== 'menunggu') {
            return res.redirect('/petugas/kelolaPeminjaman');
        }
        await peminjamanModel.updateStatus(id, 'dipinjam');
        const details = await detailPeminjamanModel.getByPeminjamanId(id);
        for (const d of details) {
            await alatModel.kurangiStok(d.id_alat, d.jumlah);
        }
        await logModel.create(req.session.user.id, `Menyetujui peminjaman ID ${id}`);
        res.redirect('/petugas/kelolaPeminjaman');
    },
    
    formPengembalian: async (req, res) => {
        const id = req.params.id;
        const peminjaman = await peminjamanModel.getById(id);
        if (!peminjaman || peminjaman.status !== 'dipinjam') {
            return res.redirect('/petugas/kelolaPeminjaman');
        }
        res.render('petugas/formPengembalian', { 
            title: 'Proses Pengembalian', 
            user: req.session.user, 
            peminjaman 
        });
    },
    
    prosesPengembalian: async (req, res) => {
        const id = req.params.id;
        const { kondisi, catatan } = req.body;
        const peminjaman = await peminjamanModel.getById(id);
        if (!peminjaman || peminjaman.status !== 'dipinjam') {
            return res.redirect('/petugas/kelolaPeminjaman');
        }
        await pengembalianModel.create({
            id_peminjaman: id,
            tanggal_kembali: new Date().toISOString().slice(0,10),
            kondisi,
            catatan
        });
        await peminjamanModel.updateStatus(id, 'dikembalikan');
        const details = await detailPeminjamanModel.getByPeminjamanId(id);
        for (const d of details) {
            await alatModel.tambahStok(d.id_alat, d.jumlah);
        }
        await logModel.create(req.session.user.id, `Memproses pengembalian peminjaman ID ${id}`);
        res.redirect('/petugas/kelolaPeminjaman');
    }
};