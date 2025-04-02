import { Router, Request, Response } from 'express';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

// General protected routes
router.get('/profile', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'Welcome to your profile!', user: req.user });
});
router.get('/dashboard', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'Welcome to your dashboard!', user: req.user });
});
router.get('/notifications', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'View your notifications!', user: req.user });
});
router.put('/profile/update', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'Update your profile!', user: req.user });
});

// Community routes
router.get('/community/forums', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the forums!', user: req.user });
});
router.get('/community/resources', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'Access community resources!', user: req.user });
});

// Admin routes
router.get('/admin', authenticateToken, authorize(['ADMIN']), (req: Request, res: Response) => {
    res.json({ message: 'Welcome, Admin!', user: req.user });
});
router.get('/admin/courses', authenticateToken, authorize(['ADMIN']), (req: Request, res: Response) => {
    res.json({ message: 'Manage courses here!', user: req.user });
});
router.get('/admin/events', authenticateToken, authorize(['ADMIN']), (req: Request, res: Response) => {
    res.json({ message: 'Manage events here!', user: req.user });
});
router.get('/admin/settings', authenticateToken, authorize(['ADMIN']), (req: Request, res: Response) => {
    res.json({ message: 'Access admin settings!', user: req.user });
});

// Instructor routes
router.get('/instructor', authenticateToken, authorize(['INSTRUCTOR']), (req: Request, res: Response) => {
    res.json({ message: 'Welcome, Instructor!', user: req.user });
});
router.post('/instructor/courses', authenticateToken, authorize(['INSTRUCTOR']), (req: Request, res: Response) => {
    res.json({ message: 'Create a new course!', user: req.user });
});
router.get('/instructor/events', authenticateToken, authorize(['INSTRUCTOR']), (req: Request, res: Response) => {
    res.json({ message: 'Manage your events here!', user: req.user });
});

// Student routes
router.post('/student/enroll', authenticateToken, authorize(['STUDENT']), (req: Request, res: Response) => {
    res.json({ message: 'Enroll in a course!', user: req.user });
});
router.get('/student/courses', authenticateToken, authorize(['STUDENT']), (req: Request, res: Response) => {
    res.json({ message: 'View your enrolled courses!', user: req.user });
});

// Summer camp routes
router.post('/summer-camp/register', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'Register for summer camp!', user: req.user });
});
router.get('/summer-camp/details', authenticateToken, (req: Request, res: Response) => {
    res.json({ message: 'View summer camp details!', user: req.user });
});

export default router;
