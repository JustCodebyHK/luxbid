import bcrypt from 'bcrypt';

const hash = await bcrypt.hash('luxtejas083', 10);
console.log('Hashed password:', hash);