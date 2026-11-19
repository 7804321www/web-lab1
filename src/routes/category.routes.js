const router = require('express').Router();
const controller = require('../controllers/category.controller');
const { validateBody, validateId } = require('../middleware/validate');

const schema = {
  name: { type: 'string', required: true, min: 2, max: 100 },
  description: { type: 'string', max: 500 },
};

router.get('/', controller.getAll);
router.get('/:id', validateId(), controller.getOne);
router.post('/', validateBody(schema), controller.create);
router.put('/:id', validateId(), validateBody(schema, { partial: true }), controller.update);
router.delete('/:id', validateId(), controller.remove);

module.exports = router;
