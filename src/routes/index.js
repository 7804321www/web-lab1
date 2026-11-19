const router = require('express').Router();

router.use('/users', require('./user.routes'));
router.use('/categories', require('./category.routes'));
router.use('/tags', require('./tag.routes'));
router.use('/posts', require('./post.routes'));
router.use('/comments', require('./comment.routes'));

module.exports = router;
