const router = require('express').Router();
const controller = require('../controllers/post.controller');
const { validateBody, validateId } = require('../middleware/validate');

const schema = {
  title: { type: 'string', required: true, min: 3, max: 200 },
  content: { type: 'string', required: true, min: 1 },
  published: { type: 'boolean' },
  authorId: { type: 'int', required: true },
  categoryId: { type: 'int' },
  tags: { type: 'stringArray' },
};

// authorId не можна змінювати після створення статті
const { authorId, ...updateSchema } = schema;

router.get('/', controller.getAll);
router.get('/:id', validateId(), controller.getOne);
router.post('/', validateBody(schema), controller.create);
router.put('/:id', validateId(), validateBody(updateSchema, { partial: true }), controller.update);
router.delete('/:id', validateId(), controller.remove);

module.exports = router;
