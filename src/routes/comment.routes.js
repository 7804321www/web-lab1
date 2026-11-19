const router = require('express').Router();
const controller = require('../controllers/comment.controller');
const { validateBody, validateId } = require('../middleware/validate');

const createSchema = {
  content: { type: 'string', required: true, min: 1, max: 2000 },
  postId: { type: 'int', required: true },
  authorId: { type: 'int', required: true },
};

const updateSchema = {
  content: { type: 'string', required: true, min: 1, max: 2000 },
};

router.get('/', controller.getAll);
router.get('/:id', validateId(), controller.getOne);
router.post('/', validateBody(createSchema), controller.create);
router.put('/:id', validateId(), validateBody(updateSchema), controller.update);
router.delete('/:id', validateId(), controller.remove);

module.exports = router;
