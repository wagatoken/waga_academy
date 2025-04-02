import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if the admin user already exists
  let admin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash: 'hashedpassword', // Replace with a real hashed password
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
    });
    console.log('Admin user created:', admin);
  } else {
    console.log('Admin user already exists:', admin);
  }

  // Check if the forum category already exists
  let category = await prisma.forumCategory.findUnique({
    where: { slug: 'general-discussion' },
  });

  if (!category) {
    category = await prisma.forumCategory.create({
      data: {
        name: 'General Discussion',
        description: 'A place for general topics.',
        slug: 'general-discussion',
        order: 1, // Add the required 'order' field
      },
    });
    console.log('Forum category created:', category);
  } else {
    console.log('Forum category already exists:', category);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });