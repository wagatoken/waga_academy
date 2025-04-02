import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// Create a new post
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { topicId, content, parentId } = req.body;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const post = await prisma.forumPost.create({
      data: {
        topicId: parseInt(topicId, 10), // Ensure topicId is a number
        content,
        parentId: parentId ? parseInt(parentId, 10) : null, // Ensure parentId is a number or null
        authorId: user.id,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all posts in a topic
router.get('/topic/:topicId', async (req: Request, res: Response): Promise<void> => {
  const { topicId } = req.params;

  try {
    const posts = await prisma.forumPost.findMany({
      where: { topicId: parseInt(topicId, 10) }, // Ensure topicId is a number
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a post
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { content } = req.body;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const post = await prisma.forumPost.findUnique({
      where: { id: parseInt(id, 10) }, // Ensure id is a number
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.authorId !== user.id) {
      res.status(403).json({ error: 'Forbidden: You can only edit your own posts' });
      return;
    }

    const updatedPost = await prisma.forumPost.update({
      where: { id: parseInt(id, 10) },
      data: { content },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a post
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const post = await prisma.forumPost.findUnique({
      where: { id: parseInt(id, 10) }, // Ensure id is a number
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.authorId !== user.id) {
      res.status(403).json({ error: 'Forbidden: You can only delete your own posts' });
      return;
    }

    await prisma.forumPost.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;