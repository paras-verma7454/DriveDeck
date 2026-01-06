import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const permissionsToSeed = [
  'cars.create',
  'cars.edit',
  'cars.delete',
  'cars.view',
  'users.delete',
  'users.view',
  'roles.view',
  'roles.manage',
  'permissions.view'
];

async function main() {
  console.log('Start seeding...');
  for (const perm of permissionsToSeed) {
    const permission = await prisma.permission.upsert({
      where: { key: perm },
      update: {},
      create: { key: perm },
    });
    console.log(`Created or found permission: ${permission.key}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
