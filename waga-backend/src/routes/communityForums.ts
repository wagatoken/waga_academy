import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// Get all forums
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const forums = await prisma.forumCategory.findMany({
      include: { topics: true },
    });
    res.status(200).json(forums);
  } catch (error) {
    console.error('Error fetching forums:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new forum category (Admin only)
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { name, description, slug, order } = req.body;

  try {
    const forumCategory = await prisma.forumCategory.create({
      data: { name, description, slug, order },
    });
    res.status(201).json(forumCategory);
  } catch (error) {
    console.error('Error creating forum category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;