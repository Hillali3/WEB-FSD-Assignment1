const express = require('express');
const router = express.Router();
const CommentController  = require('../controllers/comment'); 

router.post('/', CommentController.createComment);
router.get('/', CommentController.getComments);
router.get('/:id', CommentController.getCommentById);
router.put('/:id', CommentController.updateComment);
router.delete('/:id', CommentController.deleteComment);

module.exports = router;