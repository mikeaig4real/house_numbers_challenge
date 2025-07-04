import { Router } from 'express';
import { signUp, login, logout } from '../controllers/auth';
import { validate } from "../middleware/validate";
import { signUpSchema, loginSchema } from '../schemas';

const router = Router();

router.post('/signup', validate(signUpSchema), signUp);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

export default router;
