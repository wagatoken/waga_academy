import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// Create a new topic
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { categoryId, title, content } = req.body;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const topic = await prisma.forumTopic.create({
      data: {
        categoryId: parseInt(categoryId, 10), // Ensure categoryId is a number
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        content,
        authorId: user.id,
      },
    });
    res.status(201).json(topic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all topics in a category
router.get('/category/:categoryId', async (req: Request, res: Response): Promise<void> => {
  const { categoryId } = req.params;

  try {
    const topics = await prisma.forumTopic.findMany({
      where: { categoryId: parseInt(categoryId, 10) }, // Ensure categoryId is a number
    });
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single topic by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const topic = await prisma.forumTopic.findUnique({
      where: { id: parseInt(id, 10) }, // Ensure id is a number
    });

    if (!topic) {
      res.status(404).json({ error: 'Topic not found' });
      return;
    }

    res.status(200).json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a topic
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, content } = req.body;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const topic = await prisma.forumTopic.findUnique({
      where: { id: parseInt(id, 10) }, // Ensure id is a number
    });

    if (!topic) {
      res.status(404).json({ error: 'Topic not found' });
      return;
    }

    if (topic.authorId !== user.id) {
      res.status(403).json({ error: 'Forbidden: You can only edit your own topics' });
      return;
    }

    const updatedTopic = await prisma.forumTopic.update({
      where: { id: parseInt(id, 10) },
      data: { title, content },
    });

    res.status(200).json(updatedTopic);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a topic
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const topic = await prisma.forumTopic.findUnique({
      where: { id: parseInt(id, 10) }, // Ensure id is a number
    });

    if (!topic) {
      res.status(404).json({ error: 'Topic not found' });
      return;
    }

    if (topic.authorId !== user.id) {
      res.status(403).json({ error: 'Forbidden: You can only delete your own topics' });
      return;
    }

    await prisma.forumTopic.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;