import db from '../models/index.js';

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management
 */

export const createStudent = async (req, res) => {
    try {
        const student = await db.Student.create(req.body);
        res.status(201).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students (paginated)
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of students per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order by student ID
 *       - in: query
 *         name: populate
 *         schema:
 *         type: string
 *         description: Whether to include related Course data(e.g. 'course')
 *     responses:
 *       200:
 *         description: List of students with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 */
/**
 * Retrieves a paginated list of students from the database.
 *
 * Query Parameters:
 * @param {number} [req.query.limit=10] - The maximum number of students to return per page.
 * @param {number} [req.query.page=1] - The page number to retrieve.
 * @param {string} [req.query.sort='asc'] - The sort order for the results ('asc' or 'desc').
 * @param {boolean|string} [req.query.populate='false'] - Whether to include related Course data.
 * @param {boolean|string} [req.query.populate] - Whether to include related Course data.
 *
 * Response:
 * - 200: Returns a JSON object containing:
 *   - meta: { totalItems, page, totalPages }
 *   - data: Array of student objects
 * - 500: Returns an error message if the operation fails.
 *
 * @async
 * @function getAllStudents
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const getAllStudents = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === 'desc' ? 'DESC' : 'ASC';
    const populate = req.query.populate ? req.query.populate.toLowerCase() : '';

    try {
        const totalCount = await db.Student.count();
        const students = await db.Student.findAll({
            limit: limit,
            offset: (page - 1) * limit,
            order: [['id', sort]],
            include: populate ? populate.split(',').map(model => {
                if (model === 'course') return { model: db.Course };
                return null;
            }).filter(Boolean) : []
        });
        res.json({
            meta: {
                totalItems: totalCount,
                page: page,
                totalPages: Math.ceil(totalCount / limit),
            },
            data: students,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: A student
 *       404:
 *         description: Not found
 */
export const getStudentById = async (req, res) => {
    try {
        const student = await db.Student.findByPk(req.params.id, { include: db.Course });
        if (!student) return res.status(404).json({ message: 'Not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200:
 *         description: Updated
 */
export const updateStudent = async (req, res) => {
    try {
        const student = await db.Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ message: 'Not found' });
        await student.update(req.body);
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 */
export const deleteStudent = async (req, res) => {
    try {
        const student = await db.Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ message: 'Not found' });
        await student.destroy();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};