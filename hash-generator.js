const bcrypt = require('bcrypt');

const passwords = ['admin123', 'petugas123', 'peminjam123'];

console.log('=' .repeat(60));
console.log('PASSWORD HASH GENERATOR');
console.log('=' .repeat(60));

for (const pwd of passwords) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pwd, salt);
    console.log(`\nPassword: ${pwd}`);
    console.log(`Hash    : ${hash}`);
    console.log('-'.repeat(60));
}

console.log('\n\n⚠️  COPY HASH DI ATAS UNTUK DI-INSERT KE DATABASE! ⚠️');