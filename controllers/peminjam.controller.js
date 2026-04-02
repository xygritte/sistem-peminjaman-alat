const alatModel = require('../models/alat.model');
const peminjamanModel = require('../models/peminjaman.model');
const detailPeminjamanModel = require('../models/detailPeminjaman.model');
const logModel = require('../models/log.model');

module.exports = {
    dashboard: async (req, res) => {
        const riwayat = await peminjamanModel.getByUserId(req.session.user.id);
        res.render('peminjam/dashboard', { 
            title: 'Dashboard Peminjam', 
            user: req.session.user, 
            riwayat: riwayat 
        });
    },
    
    daftarAlat: async (req, res) => {
        const alat = await alatModel.getAll();
        res.render('peminjam/daftarAlat', { title: 'Daftar Alat', user: req.session.user, alat });
    },
    
    ajukanPeminjamanForm: async (req, res) => {
        const alat = await alatModel.getAll();
        res.render('peminjam/ajukanPeminjaman', { title: 'Ajukan Peminjaman', user: req.session.user, alat, error: null });
    },
    
    ajukanPeminjaman: async (req, res) => {
        try {
            const { tanggal_rencana_kembali } = req.body;
            const alatList = [];
            
            console.log('Request body:', req.body);
            
            // Loop melalui semua field di req.body
            for (const [key, value] of Object.entries(req.body)) {
                // Cari field yang namanya dimulai dengan "jumlah_"
                if (key.startsWith('jumlah_') && parseInt(value) > 0) {
                    // Ambil ID alat dari nama field (jumlah_1, jumlah_2, dst)
                    const id_alat = parseInt(key.replace('jumlah_', ''));
                    const jumlah = parseInt(value);
                    
                    if (!isNaN(id_alat) && id_alat > 0 && jumlah > 0) {
                        alatList.push({ id_alat, jumlah });
                    }
                }
            }
            
            console.log('Alat yang dipilih:', alatList);
            
            if (alatList.length === 0) {
                const alat = await alatModel.getAll();
                return res.render('peminjam/ajukanPeminjaman', { 
                    title: 'Ajukan Peminjaman', 
                    user: req.session.user, 
                    alat, 
                    error: 'Pilih minimal satu alat yang akan dipinjam' 
                });
            }
            
            // Validasi stok untuk setiap alat
            for (const item of alatList) {
                const alat = await alatModel.getById(item.id_alat);
                
                if (!alat) {
                    const alatListAll = await alatModel.getAll();
                    return res.render('peminjam/ajukanPeminjaman', { 
                        title: 'Ajukan Peminjaman', 
                        user: req.session.user, 
                        alat: alatListAll, 
                        error: `Alat dengan ID ${item.id_alat} tidak ditemukan di dalam sistem.` 
                    });
                }
                
                if (alat.jumlah_tersedia < item.jumlah) {
                    const alatListAll = await alatModel.getAll();
                    return res.render('peminjam/ajukanPeminjaman', { 
                        title: 'Ajukan Peminjaman', 
                        user: req.session.user, 
                        alat: alatListAll, 
                        error: `Stok ${alat.nama_alat} tidak mencukupi (Tersedia: ${alat.jumlah_tersedia}, Diminta: ${item.jumlah})` 
                    });
                }
            }
            
            // Buat peminjaman baru
            const id_peminjaman = await peminjamanModel.create({
                id_user: req.session.user.id,
                tanggal_pinjam: new Date().toISOString().slice(0,10),
                tanggal_rencana_kembali,
                status: 'menunggu'
            });
            
            console.log(`Peminjaman dibuat dengan ID: ${id_peminjaman}`);
            
            // Simpan detail peminjaman
            for (const item of alatList) {
                await detailPeminjamanModel.create(id_peminjaman, item.id_alat, item.jumlah);
                console.log(`Detail: Alat ID ${item.id_alat}, Jumlah ${item.jumlah}`);
            }
            
            await logModel.create(req.session.user.id, `Mengajukan peminjaman ID ${id_peminjaman}`);
            res.redirect('/peminjam/riwayat');
            
        } catch (error) {
            console.error('Error in ajukanPeminjaman:', error);
            const alat = await alatModel.getAll();
            res.render('peminjam/ajukanPeminjaman', { 
                title: 'Ajukan Peminjaman', 
                user: req.session.user, 
                alat, 
                error: 'Terjadi kesalahan sistem: ' + error.message 
            });
        }
    },
    
    riwayat: async (req, res) => {
        const riwayat = await peminjamanModel.getByUserId(req.session.user.id);
        res.render('peminjam/riwayat', { title: 'Riwayat Peminjaman', user: req.session.user, riwayat });
    }
};