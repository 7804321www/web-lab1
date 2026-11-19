const router = require('express').Router();
const controller = require('../controllers/tag.controller');
const { validateBody, validateId } = require('../middleware/validate');

const schema = {
  name: { type: 'string', required: true, min: 1, max: 50 },
};

router.get('/', controller.getAll);
router.get('/:id', validateId(), controller.getOne);
router.post('/', validateBody(schema), controller.create);
router.put('/:id', validateId(), validateBody(schema), controller.update);
router.delete('/:id', validateId(), controller.remove);

module.exports = router;
