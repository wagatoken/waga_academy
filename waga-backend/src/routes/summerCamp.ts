import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// Register for summer camp
router.post('/register', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { campId, firstName, lastName, email, phone, role, expertise, availability, motivation } = req.body;
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const registration = await prisma.campRegistration.create({
      data: {
        user: { connect: { id: user.id } }, // Connect the registration to the authenticated user
        camp: { connect: { id: campId } }, // Connect the registration to the specified camp
        firstName,
        lastName,
        email,
        phone,
        role,
        expertise,
        availability,
        motivation,
      },
    });
    res.status(201).json(registration);
  } catch (error) {
    console.error('Error registering for summer camp:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;