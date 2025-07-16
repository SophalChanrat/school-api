import express from 'express';
import {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} from '../controllers/student.controller.js';
import auth from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

router.get('/', auth, studentController.getAllStudents);
router.post('/', auth, studentController.createStudent);

export default router;

/**
 * @swagger
 * /students:
 *  get:
 *    summary: Get students
 *    security:
 *      - bearerAuth: []
 *    tags: [Students]
 *    responses: …
 */
