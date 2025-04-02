import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();
const router = Router();

// Registration Endpoint
router.post(
    '/register',
    async (req: Request, res: Response): Promise<void> => {
        const { email, password, firstName, lastName, role } = req.body;

        // Validate input
        if (!email || !password || !firstName || !lastName) {
            res.status(400).json({ error: 'All fields are required.' });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ error: 'Password must be at least 8 characters long.' });
            return;
        }

        try {
            // Check if the user already exists
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                res.status(400).json({ error: 'Email is already registered.' });
                return;
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the user
            const user = await prisma.user.create({
                data: {
                    email,
                    passwordHash: hashedPassword,
                    firstName,
                    lastName,
                    role: role || 'STUDENT', // Default role is STUDENT
                },
            });

            // Generate a JWT
            const token = generateToken({ id: user.id, role: user.role });

            res.status(201).json({ token, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
);

// Login Endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
    }

    try {
        // Find the user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        // Generate a JWT
        const token = generateToken({ id: user.id, role: user.role });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;