/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: comments related endpoints
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     parameters:
 *       - in: body
 *         name: comment
 *         description: The comment to create
 *         schema:
 *           type: object
 *           required:
 *             - userId
 *             - content
 *           properties:
 *             userId:
 *               type: string
 *             content:
 *               type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /comments/id/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /comments/postId/{postId}:
 *   get:
 *     summary: Get comments by post ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to retrieve comments for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       404:
 *         description: Comments not found
 */

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to update
 *         schema:
 *           type: string
 *       - in: body
 *         name: comment
 *         description: The updated comment data
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */

import { Router } from "express";

const router = Router();
const CommentController = require("../controllers/comment");
import { authenticate } from "../middlewares/authMiddleware";

router.use(authenticate); // Add authentication middleware to all routes

router.post("/", (req, res) => {
  CommentController.createComment(req, res);
});

router.get("/id/:id", (req, res) => {
  CommentController.getCommentById(req, res);
});

router.get("/postId/:postId", (req, res) => {
  CommentController.getCommentsByPost(req, res);
});

router.put("/:id", (req, res) => {
  CommentController.updateComment(req, res);
});

router.delete("/:id", (req, res) => {
  CommentController.deleteComment(req, res);
});

export default router;
