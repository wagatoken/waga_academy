import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Example of a protected route (accessible to all authenticated users)
router.get('/profile', authenticate, (req: Request, res: Response) => {
    res.json({ message: 'Welcome to your profile!', user: req.user });
});

// Example of a role-restricted route (accessible only to ADMIN users)
router.get('/admin', authenticate, authorize(['ADMIN']), (req: Request, res: Response) => {
    res.json({ message: 'Welcome, Admin!', user: req.user });
});

// Example of a role-restricted route (accessible only to INSTRUCTOR users)
router.get('/instructor', authenticate, authorize(['INSTRUCTOR']), (req: Request, res: Response) => {
    res.json({ message: 'Welcome, Instructor!', user: req.user });
});

export default router;