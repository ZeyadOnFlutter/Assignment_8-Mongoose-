import { Router } from 'express';
import * as noteService from './note.service.js';
const router = Router();

router.post('/', noteService.createNote);
router.get('/aggregate', noteService.getAllNotesWithAggregation);
router.get('/paginate-sort', noteService.getPaginatedNotes);
router.get('/note-by-content', noteService.getNoteByContent);
router.get('/note-with-user', noteService.getAllNotesWithUserInfo);
router.get('/:id', noteService.getNoteById);
router.patch('/all', noteService.updateAllNote);
router.patch('/:noteId', noteService.updateNote);
router.put('/replace/:noteId', noteService.replaceNote);
router.delete('/', noteService.deleteAllNotes);
router.delete('/:noteId', noteService.deleteNote);

export default router;
