import { Router } from 'express';
import * as userService from './user.service.js';

const router = Router();
router.post('/signup', userService.signUp);
router.post('/login', userService.login);
router.patch('/update', userService.updateUser);
router.delete('/delete', userService.deleteUser);
router.get('/get', userService.getUser);
export default router;
