import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 10;

async function main() {
  console.log('Seeding users...');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@123', BCRYPT_ROUNDS);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@codeandsmile.org' },
    update: {},
    create: {
      email: 'admin@codeandsmile.org',
      username: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      password: adminPassword,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Normal learner user
  const userPassword = await bcrypt.hash('User@123', BCRYPT_ROUNDS);
  const user = await prisma.user.upsert({
    where: { email: 'user@codeandsmile.org' },
    update: {},
    create: {
      email: 'user@codeandsmile.org',
      username: 'learner',
      firstName: 'Demo',
      lastName: 'User',
      password: userPassword,
      role: 'LEARNER',
      isEmailVerified: true,
    },
  });
  console.log(`Created learner user: ${user.email}`);

  console.log('\n--- User Credentials ---');
  console.log('Admin:');
  console.log('  Email: admin@codeandsmile.org');
  console.log('  Password: Admin@123');
  console.log('\nLearner:');
  console.log('  Email: user@codeandsmile.org');
  console.log('  Password: User@123');
  console.log('------------------------\n');
}

main()
  .catch((e) => {
    console.error('Error seeding users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
