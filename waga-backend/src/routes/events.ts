import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorize } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// Create a new event (Admin only)
// Create a new event (Admin only)
router.post('/', authenticateToken, authorize(['ADMIN']), async (req: Request, res: Response): Promise<void> => {
    const { title, description, startDate, endDate, location, type, category, tags, imageUrl, capacity, registrationDeadline } = req.body;
    const user = req.user; // Get the authenticated user
  
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  
    try {
      const event = await prisma.event.create({
        data: {
          title,
          description,
          startDate: new Date(startDate), // Use startDate from the request
          endDate: new Date(endDate), // Use endDate from the request
          location,
          type,
          category,
          tags,
          imageUrl,
          capacity,
          registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
          organizer: { connect: { id: user.id } }, // Connect the event to the authenticated user as the organizer
        },
      });
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
// Get all events
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await prisma.event.findMany();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single event by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an event (Admin only)
router.put('/:id', authenticateToken, authorize(['ADMIN']), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, startDate, endDate, location, type, category, tags, imageUrl, capacity, registrationDeadline } = req.body;

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        description,
        startDate: new Date(startDate), // Use startDate from the request
        endDate: new Date(endDate), // Use endDate from the request
        location,
        type,
        category,
        tags,
        imageUrl,
        capacity,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
      },
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an event (Admin only)
router.delete('/:id', authenticateToken, authorize(['ADMIN']), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    await prisma.event.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;