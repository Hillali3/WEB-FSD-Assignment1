import { Router } from "express";

const postController = require("../controllers/post");
const router = Router();
import { authenticate } from "../middlewares/authMiddleware";

router.use(authenticate); // Add authentication middleware to all routes

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", (req, res) => {
  postController.createPost(req, res);
});
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/", (req, res) => {
  postController.getPosts(req, res);
});

/**
 * @swagger
 * /posts/id/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.get("/id/:id", (req, res) => {
  postController.getPostById(req, res);
});

/**
 * @swagger
 * /posts/userId/{userId}:
 *   get:
 *     summary: Get posts by user ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of posts by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: User not found
 */
router.get("/userId/:userId", (req, res) => {
  postController.getPostByUserId(req, res);
});

/**
 * @swagger
 * /posts/username/{username}:
 *   get:
 *     summary: Get posts by username
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username
 *     responses:
 *       200:
 *         description: List of posts by the username
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: User not found
 */
router.get("/username/:username", (req, res) => {
  postController.getPostByUsername(req, res);
});

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Post not found
 */
router.put("/:id", (req, res) => {
  postController.updatePost(req, res);
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete("/:id", (req, res) => {
  postController.deletePost(req, res);
});

export default router;