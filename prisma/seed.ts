import prisma from '@/lib/db/prisma';
import bcrypt from 'bcrypt';

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create a tutor user
  const tutor = await prisma.user.upsert({
    where: { email: 'tutor@example.com' },
    update: {},
    create: {
      email: 'tutor@example.com',
      username: 'tutoruser',
      firstName: 'Tutor',
      lastName: 'User',
      password: passwordHash,
      role: 'TUTOR',
      isEmailVerified: true,
    },
  });

  console.log('Created tutor user:', tutor);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
