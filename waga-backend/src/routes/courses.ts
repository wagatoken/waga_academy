import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorize } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// Create a new course (Admin only)
router.post('/', authenticateToken, authorize(['ADMIN']), async (req: Request, res: Response): Promise<void> => {
  const { title, description, instructorId } = req.body;

  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
        instructorId,
      },
    });
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all courses
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single course by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a course (Admin only)
router.put('/:id', authenticateToken, authorize(['ADMIN']), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, instructorId } = req.body;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id, 10) },
      data: { title, description, instructorId },
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a course (Admin only)
router.delete('/:id', authenticateToken, authorize(['ADMIN']), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    await prisma.course.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;