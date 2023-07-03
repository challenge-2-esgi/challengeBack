import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetDB() {
  await prisma.user.deleteMany({});
}

async function insertUsers() {
  const hashedPassword = await bcrypt.hash('password', 10);

  await prisma.user.create({
    data: {
      firstname: 'Jack',
      lastname: 'Doe',
      email: 'admin@dev.fr',
      password: hashedPassword,
      roles: ['ADMIN'],
    },
  });

  const user1 = await prisma.user.create({
    data: {
      firstname: 'John',
      lastname: 'Doe',
      email: 'candidat@dev.fr',
      password: hashedPassword,
      roles: ['CANDIDATE'],
    },
  });

  const user2 = await prisma.user.create({
    data: {
      firstname: 'Sonia',
      lastname: 'Doe',
      email: 'recruteur@dev.fr',
      password: hashedPassword,
      roles: ['RECRUITER'],
    },
  });

  return [user1, user2];
}

async function main() {
  await resetDB();
  await insertUsers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('error on seed ', e);
    await prisma.$disconnect();
    process.exit(1);
  });
