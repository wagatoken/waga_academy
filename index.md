import { PrismaClient } from '@prisma/client';
import express from 'express';
import bcrypt from 'bcrypt';
import authRoutes from './routes/auth';
import protectedRoutes from './routes/protected';

const prisma = new PrismaClient();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Mount the auth routes
app.use('/api/auth', authRoutes);

// Mount the protected routes
app.use('/api/protected', protectedRoutes);

// Prisma seed data
async function seedDatabase() {
  // Hash the password for the seeded user
  const hashedPassword = await bcrypt.hash('securepassword', 10);

  // Check if the user already exists
  let existingUser = await prisma.user.findUnique({
    where: { email: 'author@example.com' },
  });

  if (!existingUser) {
    // Create a user (author) if it doesn't exist
    existingUser = await prisma.user.create({
      data: {
        email: 'author@example.com',
        passwordHash: hashedPassword, // Use hashed password
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
        isEmailVerified: true,
      },
    });
    console.log('Author created:', existingUser);
  } else {
    console.log('Author already exists:', existingUser);
  }

  // Create a forum category
  const category = await prisma.forumCategory.create({
    data: {
      name: 'General Discussion',
      description: 'A place for general topics.',
      slug: 'general-discussion',
      order: 1,
    },
  });
  console.log('Forum category created:', category);

  // Create a forum topic
  const topic = await prisma.forumTopic.create({
    data: {
      categoryId: category.id,
      title: 'What is Blockchain?',
      slug: 'what-is-blockchain',
      authorId: existingUser.id, // Use the existing user's ID
      content: 'Let’s discuss the basics of blockchain technology.',
      isPinned: false,
      isLocked: false,
    },
  });
  console.log('Forum topic created:', topic);

  // Create a parent post
  const parentPost = await prisma.forumPost.create({
    data: {
      topicId: topic.id,
      authorId: existingUser.id, // Use the existing user's ID
      content: 'Blockchain is a distributed ledger technology.',
    },
  });
  console.log('Parent post created:', parentPost);

  // Create a reply to the parent post
  const replyPost = await prisma.forumPost.create({
    data: {
      topicId: topic.id,
      authorId: existingUser.id, // Use the existing user's ID
      content: 'That’s interesting! Can you explain more?',
      parentId: parentPost.id, // Reference the parent post
    },
  });
  console.log('Reply post created:', replyPost);
}

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Seed the database
  try {
    await seedDatabase();
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await prisma.$disconnect();
  }
});