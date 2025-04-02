import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('Resetting database...');

    // Delete data in the correct order to avoid foreign key constraint violations
    await prisma.forumPost.deleteMany({});
    await prisma.forumTopic.deleteMany({});
    await prisma.forumCategory.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('Database reset successfully.');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();